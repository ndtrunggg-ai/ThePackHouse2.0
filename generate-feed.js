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

async function generateFeed() {
  try {
    console.log('Fetching products from Strapi...');
    const result = await fetchProducts();
    const products = result.data || [];

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>The Pack House</title>
    <link>${SITE_URL}</link>
    <description>Sản phẩm Balo, Túi Xách, Vali từ The Pack House</description>
`;

    products.forEach(p => {
      // Find the image URL, preferring JPG/PNG over AVIF for Google Merchant
      let imageUrl = '';
      if (p.image) {
        const imgObj = Array.isArray(p.image) ? p.image[0] : (p.image.data ? (Array.isArray(p.image.data) ? p.image.data[0] : p.image.data) : p.image);
        let url = imgObj && (imgObj.url || (imgObj.attributes && imgObj.attributes.url));
        
        // Google Merchant does not support AVIF/WEBP. Try to get a standard format from Strapi's 'formats'
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
      
      // Calculate brand
      let brand = p.brand;
      if (p.name && (p.name.toLowerCase().includes('mt carrier') || p.name.toLowerCase().includes('point 65'))) {
        brand = 'Point 65 North';
      } else if (brand === 'thule') {
        brand = 'Thule';
      } else if (brand === 'case-logic') {
        brand = 'Case Logic';
      }
      
      xml += `    <item>
      <g:id>${p.id}</g:id>
      <g:title>${escapeXML(p.name)}</g:title>
      <g:description>${escapeXML(p.description || p.name)}</g:description>
      <g:link>${SITE_URL}</g:link>
      <g:image_link>${escapeXML(imageUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price} VND</g:price>
      <g:brand>${escapeXML(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      ${p.original_price ? `<g:sale_price>${p.price} VND</g:sale_price>\n      <g:price>${p.original_price} VND</g:price>` : ''}
    </item>
`;
    });

    xml += `  </channel>
</rss>`;

    const docsDir = path.join(__dirname, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }
    
    fs.writeFileSync(path.join(docsDir, 'google-merchant.xml'), xml);
    console.log(`Generated docs/google-merchant.xml with ${products.length} products.`);
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    process.exit(1);
  }
}

generateFeed();
