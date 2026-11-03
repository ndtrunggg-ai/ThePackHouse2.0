'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '.data');
const SEED_FILE = process.env.SEED_FILE || path.join(__dirname, '..', 'public', 'products.json');

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'shop.db'));
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('cache_size = -8000');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    type TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    original_price INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    weight TEXT NOT NULL DEFAULT '',
    origin TEXT NOT NULL DEFAULT '',
    specs TEXT NOT NULL DEFAULT '[]',
    description TEXT NOT NULL DEFAULT '',
    images TEXT NOT NULL DEFAULT '[]',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    total INTEGER NOT NULL DEFAULT 0,
    items TEXT NOT NULL DEFAULT '[]',
    order_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT '',
    shipping_method TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS orders_phone ON orders (phone);

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES admins (id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
`);

const now = () => new Date().toISOString();
const newDocumentId = () => crypto.randomBytes(12).toString('hex');

const productFromRow = (row) => row && {
  id: row.id,
  documentId: row.document_id,
  sku: row.sku,
  name: row.name,
  brand: row.brand,
  type: row.type,
  price: row.price,
  original_price: row.original_price,
  quantity: row.quantity,
  weight: row.weight,
  origin: row.origin,
  specs: JSON.parse(row.specs),
  description: row.description,
  image: JSON.parse(row.images).map((url) => ({ url })),
  published: Boolean(row.published),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
};

const orderFromRow = (row) => row && {
  id: row.id,
  documentId: row.document_id,
  customerName: row.customer_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  city: row.city,
  total: row.total,
  items: JSON.parse(row.items),
  orderStatus: row.order_status,
  paymentMethod: row.payment_method,
  shippingMethod: row.shipping_method,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
};

const insertProduct = db.prepare(`
  INSERT INTO products (id, document_id, sku, name, brand, type, price, original_price, quantity, weight, origin, specs, description, images, published, created_at, updated_at)
  VALUES (@id, @documentId, @sku, @name, @brand, @type, @price, @original_price, @quantity, @weight, @origin, @specs, @description, @images, @published, @createdAt, @updatedAt)
`);

// Runs once on a new database. Ids are kept so existing product URLs stay valid; images are re-uploaded in the admin page.
function seedProducts() {
  if (db.pragma('user_version', { simple: true }) > 0) return;

  const seed = fs.existsSync(SEED_FILE) ? JSON.parse(fs.readFileSync(SEED_FILE, 'utf8')).data : [];
  db.transaction(() => {
    for (const p of seed) {
      insertProduct.run({
        id: p.id,
        documentId: p.documentId || newDocumentId(),
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        type: p.type,
        price: p.price || 0,
        original_price: p.original_price || 0,
        quantity: p.quantity || 0,
        weight: p.weight || '',
        origin: p.origin || '',
        specs: JSON.stringify(p.specs || []),
        description: p.description || '',
        images: '[]',
        published: 1,
        createdAt: p.createdAt || now(),
        updatedAt: p.updatedAt || now(),
      });
    }
    db.pragma('user_version = 1');
  })();
  console.log(`Seeded ${seed.length} products`);
}

seedProducts();

const products = {
  list: ({ publishedOnly = false } = {}) => db
    .prepare(`SELECT * FROM products ${publishedOnly ? 'WHERE published = 1' : ''} ORDER BY id`)
    .all()
    .map(productFromRow),

  get: (id) => productFromRow(db.prepare('SELECT * FROM products WHERE id = ?').get(id)),

  create: (fields) => {
    const stamp = now();
    const { lastInsertRowid } = insertProduct.run({
      ...fields,
      id: null,
      documentId: newDocumentId(),
      specs: JSON.stringify(fields.specs),
      images: '[]',
      published: fields.published ? 1 : 0,
      createdAt: stamp,
      updatedAt: stamp,
    });
    return products.get(lastInsertRowid);
  },

  update: (id, fields) => {
    db.prepare(`
      UPDATE products SET sku = @sku, name = @name, brand = @brand, type = @type, price = @price,
        original_price = @original_price, quantity = @quantity, weight = @weight, origin = @origin,
        specs = @specs, description = @description, published = @published, updated_at = @updatedAt
      WHERE id = @id
    `).run({
      ...fields,
      id,
      specs: JSON.stringify(fields.specs),
      published: fields.published ? 1 : 0,
      updatedAt: now(),
    });
    return products.get(id);
  },

  setImages: (id, urls) => {
    db.prepare('UPDATE products SET images = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(urls), now(), id);
    return products.get(id);
  },

  remove: (id) => db.prepare('DELETE FROM products WHERE id = ?').run(id),
};

const orders = {
  list: () => db.prepare('SELECT * FROM orders ORDER BY id DESC').all().map(orderFromRow),

  create: (fields) => {
    const stamp = now();
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO orders (document_id, customer_name, email, phone, address, city, total, items, payment_method, shipping_method, created_at, updated_at)
      VALUES (@documentId, @customerName, @email, @phone, @address, @city, @total, @items, @paymentMethod, @shippingMethod, @createdAt, @updatedAt)
    `).run({
      ...fields,
      documentId: newDocumentId(),
      items: JSON.stringify(fields.items),
      createdAt: stamp,
      updatedAt: stamp,
    });
    return orderFromRow(db.prepare('SELECT * FROM orders WHERE id = ?').get(lastInsertRowid));
  },

  setStatus: (id, status) => {
    const { changes } = db.prepare('UPDATE orders SET order_status = ?, updated_at = ? WHERE id = ?').run(status, now(), id);
    return changes > 0;
  },

  // The phone number is what stops a visitor reading someone else's order by guessing ids.
  findForTracking: (reference, phone) => orderFromRow(
    db.prepare('SELECT * FROM orders WHERE (id = ? OR document_id = ?) AND phone = ?').get(reference, reference, phone),
  ),
};

module.exports = { db, DATA_DIR, products, orders };
