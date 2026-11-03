'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { db, products, orders } = require('./db');
const auth = require('./auth');
const { publish } = require('./publish');

const PORT = Number(process.env.PORT) || 3000;
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '.data', 'uploads');
const WEBHOOK_URL = process.env.NOTIFICATION_WEBHOOK_URL;

const JSON_LIMIT = 256 * 1024;
const IMAGE_LIMIT = 15 * 1024 * 1024;
const PUBLISH_DELAY_MS = 1500;

const BRANDS = ['thule', 'case-logic', 'alpaka', 'bamkel', 'point-65'];
const TYPES = ['backpacks', 'duffel', 'luggage', 'daypacks', 'laptop-bags', 'accessory'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        chunks.length = 0;
        reject(new HttpError(413, 'Payload too large'));
      } else {
        chunks.push(chunk);
      }
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req) {
  try {
    const body = JSON.parse((await readBody(req, JSON_LIMIT)).toString('utf8'));
    if (body && typeof body === 'object' && !Array.isArray(body)) return body;
  } catch (err) {
    if (err instanceof HttpError) throw err;
  }
  throw new HttpError(400, 'Invalid JSON body');
}

function text(value, label, max, { required = false } = {}) {
  if (value !== undefined && value !== null && typeof value !== 'string' && typeof value !== 'number') {
    throw new HttpError(400, `${label} is invalid`);
  }
  const result = value === undefined || value === null ? '' : String(value).trim();
  if (required && !result) throw new HttpError(400, `${label} is required`);
  if (result.length > max) throw new HttpError(400, `${label} is too long`);
  return result;
}

function wholeNumber(value, label) {
  const result = Number(value ?? 0);
  if (!Number.isSafeInteger(result) || result < 0) throw new HttpError(400, `${label} must be a whole number`);
  return result;
}

function oneOf(value, allowed, label) {
  if (!allowed.includes(value)) throw new HttpError(400, `${label} must be one of: ${allowed.join(', ')}`);
  return value;
}

function parseOrder(body) {
  const data = body.data;
  if (!data || typeof data !== 'object') throw new HttpError(400, 'Missing order data');
  if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 100) {
    throw new HttpError(400, 'An order needs between 1 and 100 items');
  }
  return {
    customerName: text(data.customerName, 'customerName', 200, { required: true }),
    email: text(data.email, 'email', 200),
    phone: text(data.phone, 'phone', 30, { required: true }),
    address: text(data.address, 'address', 500, { required: true }),
    city: text(data.city, 'city', 100),
    total: wholeNumber(data.total, 'total'),
    items: data.items.map((item) => ({
      name: text(item && item.name, 'item name', 300, { required: true }),
      color: text(item && item.color, 'item color', 100),
      price: wholeNumber(item && item.price, 'item price'),
      image: text(item && item.image, 'item image', 500),
    })),
    paymentMethod: text(data.paymentMethod, 'paymentMethod', 30),
    shippingMethod: text(data.shippingMethod, 'shippingMethod', 30),
  };
}

function parseProduct(body) {
  const specs = body.specs === undefined ? [] : body.specs;
  if (!Array.isArray(specs) || specs.length > 100) throw new HttpError(400, 'specs must be a list');
  return {
    sku: text(body.sku, 'sku', 100, { required: true }),
    name: text(body.name, 'name', 300, { required: true }),
    brand: oneOf(body.brand, BRANDS, 'brand'),
    type: oneOf(body.type, TYPES, 'type'),
    price: wholeNumber(body.price, 'price'),
    original_price: wholeNumber(body.original_price, 'original_price'),
    quantity: wholeNumber(body.quantity, 'quantity'),
    weight: text(body.weight, 'weight', 100),
    origin: text(body.origin, 'origin', 100),
    specs: specs.map((spec) => text(spec, 'spec', 300)).filter(Boolean),
    description: text(body.description, 'description', 20000),
    published: body.published !== false,
  };
}

// Identifies uploads by their first bytes rather than trusting the declared type. SVG is excluded because it can carry scripts.
function imageExtension(bytes) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  if (bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return 'png';
  if (bytes.toString('latin1', 0, 4) === 'GIF8') return 'gif';
  if (bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  if (bytes.toString('latin1', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(bytes.toString('latin1', 8, 12))) return 'avif';
  return null;
}

const uploadPath = (url) => path.join(UPLOADS_DIR, path.basename(url));

function removeUploads(urls) {
  for (const url of urls) {
    fs.promises.unlink(uploadPath(url)).catch((err) => console.error(`Could not delete ${url}: ${err.message}`));
  }
}

function requireProduct(id) {
  const product = products.get(id);
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
}

function saveProduct(write) {
  try {
    return write();
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new HttpError(409, 'Mã SKU này đã tồn tại');
    throw err;
  }
}

function publishCatalogue() {
  try {
    const published = products.list({ publishedOnly: true });
    publish(published);
    console.log(`Published ${published.length} products`);
  } catch (err) {
    console.error(`Publishing failed, the site keeps its previous version: ${err.message}`);
  }
}

let publishTimer = null;
function schedulePublish() {
  clearTimeout(publishTimer);
  publishTimer = setTimeout(publishCatalogue, PUBLISH_DELAY_MS);
}

function notifyNewOrder(order) {
  if (!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'entry.create', model: 'order', entry: order }),
    signal: AbortSignal.timeout(5000),
  })
    .then((res) => {
      if (!res.ok) console.error(`Order ${order.id}: notifier answered ${res.status}`);
    })
    .catch((err) => console.error(`Order ${order.id}: notifier unreachable: ${err.message}`));
}

const routes = [
  ['GET', /^\/health$/, false, async () => {
    db.prepare('SELECT 1').get();
    return { status: 200, body: { status: 'ok' } };
  }],

  ['POST', /^\/api\/orders$/, false, async (req) => {
    const order = orders.create(parseOrder(await readJson(req)));
    console.log(`Order ${order.id} created`);
    notifyNewOrder(order);
    return { status: 201, body: { data: { id: order.id, documentId: order.documentId } } };
  }],

  ['GET', /^\/api\/orders\/track$/, false, async (req, params, query) => {
    const reference = text(query.get('id'), 'id', 64, { required: true }).replace(/^#/, '');
    const phone = text(query.get('phone'), 'phone', 30, { required: true });
    const order = orders.findForTracking(reference, phone);
    if (!order) throw new HttpError(404, 'Order not found');
    const { id, orderStatus, total, createdAt } = order;
    return { status: 200, body: { data: { id, orderStatus, total, createdAt } } };
  }],

  ['POST', /^\/api\/admin\/login$/, false, async (req) => {
    const { email, password } = await readJson(req);
    const token = email && password ? await auth.login(email, password) : null;
    if (!token) throw new HttpError(401, 'Invalid email or password');
    return { status: 200, body: { data: { token } } };
  }],

  ['GET', /^\/api\/admin\/orders$/, true, async () => ({ status: 200, body: { data: orders.list() } })],

  ['PUT', /^\/api\/admin\/orders\/(\d+)$/, true, async (req, [id]) => {
    const { orderStatus } = await readJson(req);
    if (!orders.setStatus(id, oneOf(orderStatus, ORDER_STATUSES, 'orderStatus'))) throw new HttpError(404, 'Order not found');
    return { status: 200, body: { data: { id: Number(id), orderStatus } } };
  }],

  ['GET', /^\/api\/admin\/products$/, true, async () => ({ status: 200, body: { data: products.list() } })],

  ['POST', /^\/api\/admin\/products$/, true, async (req) => {
    const fields = parseProduct(await readJson(req));
    const product = saveProduct(() => products.create(fields));
    schedulePublish();
    return { status: 201, body: { data: product } };
  }],

  ['PUT', /^\/api\/admin\/products\/(\d+)$/, true, async (req, [id]) => {
    const current = requireProduct(id).image.map((image) => image.url);
    const body = await readJson(req);
    const fields = parseProduct(body);

    const images = body.images === undefined ? current : body.images;
    if (!Array.isArray(images) || images.some((url) => !current.includes(url))) {
      throw new HttpError(400, 'images can only reorder or remove existing images');
    }

    const product = saveProduct(() => db.transaction(() => {
      products.update(id, fields);
      return products.setImages(id, images);
    })());
    removeUploads(current.filter((url) => !images.includes(url)));
    schedulePublish();
    return { status: 200, body: { data: product } };
  }],

  ['DELETE', /^\/api\/admin\/products\/(\d+)$/, true, async (req, [id]) => {
    const product = requireProduct(id);
    products.remove(id);
    removeUploads(product.image.map((image) => image.url));
    schedulePublish();
    return { status: 200, body: { data: { id: product.id } } };
  }],

  ['POST', /^\/api\/admin\/products\/(\d+)\/images$/, true, async (req, [id]) => {
    const current = requireProduct(id).image.map((image) => image.url);
    const bytes = await readBody(req, IMAGE_LIMIT);
    const extension = imageExtension(bytes);
    if (!extension) throw new HttpError(415, 'Only JPEG, PNG, WebP, AVIF and GIF images are accepted');

    const url = `/uploads/${crypto.randomBytes(12).toString('hex')}.${extension}`;
    const file = uploadPath(url);
    await fs.promises.writeFile(`${file}.tmp`, bytes);
    await fs.promises.rename(`${file}.tmp`, file);

    const product = products.setImages(id, [...current, url]);
    schedulePublish();
    return { status: 201, body: { data: product } };
  }],
];

async function handle(req) {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  for (const [method, pattern, adminOnly, handler] of routes) {
    const match = req.method === method && pattern.exec(pathname);
    if (match) {
      if (adminOnly && !auth.isAuthenticated(req)) throw new HttpError(401, 'Sign in required');
      return handler(req, match.slice(1), searchParams);
    }
  }
  throw new HttpError(404, 'Not found');
}

const server = http.createServer(async (req, res) => {
  let status;
  let body;
  try {
    ({ status, body } = await handle(req));
  } catch (err) {
    if (!(err instanceof HttpError)) console.error(`${req.method} ${req.url}:`, err);
    status = err instanceof HttpError ? err.status : 500;
    body = { error: { message: err instanceof HttpError ? err.message : 'Internal server error' } };
  }
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
});

function shutdown() {
  clearTimeout(publishTimer);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  server.closeIdleConnections();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function main() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  await auth.ensureFirstAdmin();
  publishCatalogue();
  server.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
