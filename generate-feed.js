const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://whimsical-renewal-84c9832818.strapiapp.com/api/products?populate=*&pagination[pageSize]=200';
const SITE_URL = 'https://thepackhouse.vn';

function fetchProducts() {
  return new Promise((resolve, reject) => {
    https.get(API_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

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
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function generateFeed() {
  try {
    console.log('Fetching products from Strapi...');
    const result = await fetchProducts();
    const products = result.data || [];

    const docsDir = path.join(__dirname, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }

    const today = new Date().toISOString().substring(0,10);

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>The Pack House</title>
    <link>${SITE_URL}</link>
    <description>Sản phẩm Balo, Túi Xách, Vali từ The Pack House</description>
`;

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

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
      'phu-kien.html': { title: 'Phụ kiện du lịch | The Pack House', desc: 'Phụ kiện, ví, móc khóa cao cấp.' }
    };

    Object.keys(categoryFiles).forEach(filename => {
      sitemap += `  <url>
    <loc>${SITE_URL}/${filename}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    });

    const indexPath = path.join(docsDir, 'index.html');
    let indexHtmlTemplate = '';
    if (fs.existsSync(indexPath)) {
      indexHtmlTemplate = fs.readFileSync(indexPath, 'utf8');

      // Generate category HTML files
      Object.entries(categoryFiles).forEach(([filename, meta]) => {
        let catHtml = indexHtmlTemplate;
        catHtml = catHtml.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
        catHtml = catHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${meta.desc}" />`);
        
        const catUrl = `${SITE_URL}/${filename}`;
        const collectionSchema = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": meta.title,
          "description": meta.desc,
          "url": catUrl
        };
        const catHeadInjection = `
  <link rel="canonical" href="${catUrl}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.desc}" />
  <meta property="og:url" content="${catUrl}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
  ${JSON.stringify(collectionSchema, null, 2)}
  </script>
</head>`;
        catHtml = catHtml.replace('</head>', catHeadInjection);
        
        fs.writeFileSync(path.join(docsDir, filename), catHtml);
      });

      // Update index.html with canonical and Website schema
      const homeUrl = `${SITE_URL}/`;
      const homeSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "The Pack House",
        "url": homeUrl
      };
      let homeHtml = indexHtmlTemplate.replace('</head>', `
  <link rel="canonical" href="${homeUrl}" />
  <script type="application/ld+json">
  ${JSON.stringify(homeSchema, null, 2)}
  </script>
</head>`);
      fs.writeFileSync(indexPath, homeHtml);
    } else {
      console.warn('docs/index.html not found, cannot generate product pages.');
    }

    products.forEach(p => {
      let imageUrl = '';
      if (p.image) {
        const imgObj = Array.isArray(p.image) ? p.image[0] : (p.image.data ? (Array.isArray(p.image.data) ? p.image.data[0] : p.image.data) : p.image);
        let url = imgObj && (imgObj.url || (imgObj.attributes && imgObj.attributes.url));
        
        if (url && (url.endsWith('.avif') || url.endsWith('.webp')) && imgObj.formats) {
          const formats = imgObj.formats;
          const altFormat = formats.large || formats.medium || formats.small || formats.thumbnail;
          if (altFormat && altFormat.url) {
            url = altFormat.url;
          }
        }
        
        if (url) {
          imageUrl = url.startsWith('/') ? `https://whimsical-renewal-84c9832818.strapiapp.com${url}` : url;
        }
      }
      
      const availability = p.quantity > 0 ? 'in_stock' : 'out_of_stock';
      
      let brand = p.brand;
      if (p.name && (p.name.toLowerCase().includes('mt carrier') || p.name.toLowerCase().includes('point 65'))) {
        brand = 'Point 65 North';
      } else if (brand === 'thule') {
        brand = 'Thule';
      } else if (brand === 'case-logic') {
        brand = 'Case Logic';
      }
      
      const slug = slugify(p.name);
      const filename = `${slug}-${p.id}.html`;
      const productUrl = `${SITE_URL}/${filename}`;
      const lastmod = p.updatedAt ? `<lastmod>${p.updatedAt.substring(0,10)}</lastmod>\n    ` : '';

      xml += `    <item>
      <g:id>${p.id}</g:id>
      <title>${escapeXML(p.name)}</title>
      <description>${escapeXML(p.description || p.name)}</description>
      <link>${productUrl}</link>
      <g:image_link>${escapeXML(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.original_price ? p.original_price : p.price} VND</g:price>
      ${p.original_price ? `<g:sale_price>${p.price} VND</g:sale_price>` : ''}
      <g:brand>${escapeXML(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
    </item>
`;

      sitemap += `  <url>
    <loc>${productUrl}</loc>
    ${lastmod}<changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

      if (indexHtmlTemplate) {
        const title = escapeXML(`${p.name} - The Pack House`);
        const desc = escapeXML(p.description || p.name);
        
        let productHtml = indexHtmlTemplate;
        
        productHtml = productHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        productHtml = productHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${desc}" />`);
        
        const structuredData = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": p.name,
          "image": imageUrl ? [imageUrl] : [],
          "description": p.description || p.name,
          "sku": p.id,
          "brand": {
            "@type": "Brand",
            "name": brand || "The Pack House"
          },
          "offers": {
            "@type": "Offer",
            "url": productUrl,
            "priceCurrency": "VND",
            "price": p.price,
            "availability": p.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        };

        const breadcrumbData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": SITE_URL
          },{
            "@type": "ListItem",
            "position": 2,
            "name": brand || "Sản phẩm",
            "item": `${SITE_URL}/${slugify(brand)}.html`
          },{
            "@type": "ListItem",
            "position": 3,
            "name": p.name
          }]
        };

        const headInjection = `
  <link rel="canonical" href="${productUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${escapeXML(imageUrl)}" />
  <meta property="og:url" content="${productUrl}" />
  <meta property="og:type" content="product" />
  <script type="application/ld+json">
  ${JSON.stringify(structuredData, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbData, null, 2)}
  </script>
</head>`;
        
        productHtml = productHtml.replace('</head>', headInjection);

        // Inject raw HTML for AI bots that don't execute JS
        const seoBody = `<div id="root">
    <main itemscope itemtype="https://schema.org/Product">
      <h1 itemprop="name">${escapeXML(p.name)}</h1>
      <p itemprop="description">${desc}</p>
      <p>Brand: <span itemprop="brand">${escapeXML(brand)}</span></p>
      <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
        <span itemprop="priceCurrency">VND</span>
        <span itemprop="price">${p.price}</span>
        <link itemprop="availability" href="${p.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}" />
      </div>
      ${imageUrl ? `<img itemprop="image" src="${escapeXML(imageUrl)}" alt="${escapeXML(p.name)}" />` : ''}
    </main>
  </div>`;
        productHtml = productHtml.replace('<div id="root"></div>', seoBody);

        fs.writeFileSync(path.join(docsDir, filename), productHtml);
      }
    });

    xml += `  </channel>\n</rss>`;
    sitemap += `</urlset>`;

    fs.writeFileSync(path.join(docsDir, 'google-merchant.xml'), xml);
    fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap);
    
    // Save the static products JSON for the frontend to consume
    fs.writeFileSync(path.join(docsDir, 'products.json'), JSON.stringify(result));
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    fs.writeFileSync(path.join(publicDir, 'products.json'), JSON.stringify(result));
    
    console.log(`Generated google-merchant.xml, sitemap.xml, products.json and ${products.length} product pages.`);
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    process.exit(1);
  }
}

generateFeed();
