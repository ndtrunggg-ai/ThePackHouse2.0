'use strict';

// Writes the catalogue as static files for nginx: products.json, one page per product,
// category pages, sitemap.xml and google-merchant.xml. Storefront traffic never reaches the api.

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const SITE_DIR = process.env.SITE_DIR || path.join(__dirname, '.data', 'site');
const SITE_URL = (process.env.SITE_URL || 'https://thepackhouse.vn').replace(/\/+$/, '');
const TEMPLATE_FILE = process.env.TEMPLATE_FILE || path.join(__dirname, 'template', 'index.html');

function escapeXML(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
}

function slugify(text) {
  if (!text) return 'product';
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// JSON placed inside a <script> tag must not be able to close it.
const jsonForScript = (value) => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');

const setTitle = (html, title) => html.replace(/<title>.*?<\/title>/, () => `<title>${title}</title>`);
const setDescription = (html, desc) => html.replace(/<meta name="description" content=".*?"\s*\/?>/, () => `<meta name="description" content="${desc}" />`);
const addToHead = (html, tags) => html.replace('</head>', () => `${tags}\n</head>`);

const categoryFiles = {
  'thule.html': { title: 'Thule - Đại lý Balo, Vali chính hãng | The Pack House', desc: 'Balo, vali, túi xách Thule chính hãng từ Thụy Điển.' },
  'case-logic.html': { title: 'Case Logic - Balo, túi laptop chính hãng | The Pack House', desc: 'Balo laptop, túi xách Case Logic chính hãng từ Mỹ.' },
  'point-65.html': { title: 'Point 65 North - Balo mô tô vỏ cứng | The Pack House', desc: 'Balo đi phượt, balo mô tô vỏ cứng Point 65 North chính hãng.' },
  'balo.html': { title: 'Balo cao cấp chính hãng | The Pack House', desc: 'Các loại balo laptop, balo du lịch, balo đi học cao cấp.' },
  'tui-xach.html': { title: 'Túi xách, túi du lịch Duffel | The Pack House', desc: 'Túi xách tay, túi du lịch Duffel sức chứa lớn.' },
  'vali.html': { title: 'Vali hành lý cao cấp | The Pack House', desc: 'Vali xách tay, vali ký gửi chính hãng siêu bền.' },
  'balo-mo-to.html': { title: 'Balo Mô Tô đi phượt | The Pack House', desc: 'Balo bảo hộ vỏ cứng cho dân đi phượt, mô tô.' },
  'tui-laptop.html': { title: 'Túi chống sốc Laptop | The Pack House', desc: 'Túi đựng laptop, túi chống sốc an toàn.' },
  'tui-deo-cheo.html': { title: 'Túi đeo chéo, túi bao tử | The Pack House', desc: 'Túi sling, túi đeo chéo thời trang.' },
  'tui-may-anh.html': { title: 'Túi Máy Ảnh chuyên nghiệp | The Pack House', desc: 'Balo, túi đựng máy ảnh DSLR, Mirrorless.' },
  'phu-kien.html': { title: 'Phụ kiện du lịch | The Pack House', desc: 'Phụ kiện, ví, móc khóa cao cấp.' },
};

function sitemapEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>\n    ` : ''}<changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

function renderHome(template) {
  const homeUrl = `${SITE_URL}/`;
  return addToHead(template, `
  <link rel="canonical" href="${homeUrl}" />
  <script type="application/ld+json">
  ${jsonForScript({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'The Pack House', url: homeUrl })}
  </script>`);
}

function renderCategory(template, filename, meta) {
  const catUrl = `${SITE_URL}/${filename}`;
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: meta.title,
    description: meta.desc,
    url: catUrl,
  };
  return addToHead(setDescription(setTitle(template, meta.title), meta.desc), `
  <link rel="canonical" href="${catUrl}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.desc}" />
  <meta property="og:url" content="${catUrl}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
  ${jsonForScript(collectionSchema)}
  </script>`);
}

function brandLabel(p) {
  const name = (p.name || '').toLowerCase();
  if (name.includes('mt carrier') || name.includes('point 65')) return 'Point 65 North';
  if (p.brand === 'thule') return 'Thule';
  if (p.brand === 'case-logic') return 'Case Logic';
  return p.brand;
}

function renderProduct(template, p, { brand, imageUrl, productUrl }) {
  const title = escapeXML(`${p.name} - The Pack House`);
  const desc = escapeXML(p.description || p.name);

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.name,
    image: imageUrl ? [imageUrl] : [],
    description: p.description || p.name,
    sku: p.id,
    brand: { '@type': 'Brand', name: brand || 'The Pack House' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: p.price,
      availability: p.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: brand || 'Sản phẩm', item: `${SITE_URL}/${slugify(brand)}.html` },
      { '@type': 'ListItem', position: 3, name: p.name },
    ],
  };

  const html = addToHead(setDescription(setTitle(template, title), desc), `
  <link rel="canonical" href="${productUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${escapeXML(imageUrl)}" />
  <meta property="og:url" content="${productUrl}" />
  <meta property="og:type" content="product" />
  <script type="application/ld+json">
  ${jsonForScript(structuredData)}
  </script>
  <script type="application/ld+json">
  ${jsonForScript(breadcrumbData)}
  </script>`);

  // Raw HTML for AI bots that don't execute JS
  const seoBody = `<div id="root">
    <main itemscope itemtype="https://schema.org/Product">
      <h1 itemprop="name">${escapeXML(p.name)}</h1>
      <p itemprop="description">${desc}</p>
      <p>Brand: <span itemprop="brand">${escapeXML(brand)}</span></p>
      <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
        <span itemprop="priceCurrency">VND</span>
        <span itemprop="price">${p.price}</span>
        <link itemprop="availability" href="${p.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}" />
      </div>
      ${imageUrl ? `<img itemprop="image" src="${escapeXML(imageUrl)}" alt="${escapeXML(p.name)}" />` : ''}
    </main>
  </div>`;
  return html.replace('<div id="root"></div>', () => seoBody);
}

function renderFeedItem(p, { brand, imageUrl, productUrl }) {
  return `    <item>
      <g:id>${p.id}</g:id>
      <title>${escapeXML(p.name)}</title>
      <description>${escapeXML(p.description || p.name)}</description>
      <link>${productUrl}</link>
      <g:image_link>${escapeXML(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.quantity > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${p.original_price ? p.original_price : p.price} VND</g:price>
      ${p.original_price ? `<g:sale_price>${p.price} VND</g:sale_price>` : ''}
      <g:brand>${escapeXML(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;
}

function renderSite(products) {
  const template = fs.existsSync(TEMPLATE_FILE) ? fs.readFileSync(TEMPLATE_FILE, 'utf8') : '';
  if (!template) console.warn(`${TEMPLATE_FILE} not found, skipping HTML pages`);

  const files = new Map();
  const today = new Date().toISOString().substring(0, 10);

  let feed = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>The Pack House</title>
    <link>${SITE_URL}</link>
    <description>Sản phẩm Balo, Túi Xách, Vali từ The Pack House</description>
`;

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntry(`${SITE_URL}/`, today, 'daily', '1.0')}`;

  for (const filename of Object.keys(categoryFiles)) {
    sitemap += sitemapEntry(`${SITE_URL}/${filename}`, today, 'weekly', '0.9');
    if (template) files.set(filename, renderCategory(template, filename, categoryFiles[filename]));
  }
  for (const page of ['privacy-policy.html', 'terms-of-service.html', 'return-policy.html']) {
    sitemap += sitemapEntry(`${SITE_URL}/${page}`, today, 'monthly', '0.3');
  }
  if (template) files.set('index.html', renderHome(template));

  for (const p of products) {
    const filename = `${slugify(p.name)}-${p.id}.html`;
    const firstImage = p.image[0] && p.image[0].url;
    const details = {
      brand: brandLabel(p),
      imageUrl: firstImage ? `${SITE_URL}${firstImage}` : '',
      productUrl: `${SITE_URL}/${filename}`,
    };
    feed += renderFeedItem(p, details);
    sitemap += sitemapEntry(details.productUrl, p.updatedAt && p.updatedAt.substring(0, 10), 'weekly', '0.8');
    if (template) files.set(filename, renderProduct(template, p, details));
  }

  feed += '  </channel>\n</rss>';
  sitemap += '</urlset>';
  files.set('google-merchant.xml', feed);
  files.set('sitemap.xml', sitemap);
  files.set('products.json', JSON.stringify({ data: products.map(({ published, ...p }) => p) }));
  return files;
}

function writeFileAtomic(file, content) {
  fs.writeFileSync(`${file}.tmp`, content);
  fs.renameSync(`${file}.tmp`, file);
}

// Writes each file with a .gz beside it, which nginx serves without spending CPU on compression.
function writeSite(files) {
  fs.mkdirSync(SITE_DIR, { recursive: true });
  const keep = new Set();
  for (const [name, content] of files) {
    writeFileAtomic(path.join(SITE_DIR, name), content);
    writeFileAtomic(path.join(SITE_DIR, `${name}.gz`), zlib.gzipSync(content, { level: 9 }));
    keep.add(name).add(`${name}.gz`);
  }
  for (const name of fs.readdirSync(SITE_DIR)) {
    if (!keep.has(name)) fs.unlinkSync(path.join(SITE_DIR, name));
  }
}

function publish(products) {
  writeSite(renderSite(products));
}

module.exports = { publish };
