'use strict';

// Imports products from a Strapi REST export on stdin and skips SKUs already in the CMS.
// Images are not imported: re-upload them in the admin panel.
// Usage: docker compose exec -T cms node scripts/seed-products.js < public/products.json

const fs = require('fs');
const { createStrapi, compileStrapi } = require('@strapi/strapi');

const UID = 'api::product.product';
const FIELDS = ['sku', 'name', 'brand', 'type', 'price', 'original_price', 'quantity', 'weight', 'origin', 'specs', 'description'];

async function main() {
  const { data } = JSON.parse(fs.readFileSync(0, 'utf8'));
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  let created = 0;
  let skipped = 0;
  const failed = [];

  for (const product of data) {
    const existing = await app.documents(UID).findFirst({ filters: { sku: product.sku }, status: 'published' });
    if (existing) {
      skipped++;
      continue;
    }
    const fields = Object.fromEntries(FIELDS.map((key) => [key, product[key]]));
    try {
      await app.documents(UID).create({ data: fields, status: 'published' });
      created++;
    } catch (err) {
      failed.push(`${product.id} sku=${product.sku}: ${err.message}`);
    }
  }

  console.log(`Seed finished: ${created} created, ${skipped} already present, ${failed.length} failed`);
  failed.forEach((line) => console.log(`  FAILED ${line}`));

  await app.destroy();
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
