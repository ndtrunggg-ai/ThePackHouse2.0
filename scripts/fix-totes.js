const fs = require('fs');
const path = require('path');

// This script simulates updating Strapi products. 
// Since we don't have direct DB access or full API token, we assume this would be run against the Strapi DB.
// A real script might connect via REST API using an admin token or directly to the SQLite database.

console.log('--- The Pack House Fix Totes Script ---');
console.log('Action: Updating all products with "Tote" in their name from type "luggage" to "duffel"');

async function fixTotes() {
  try {
    // Attempting to fetch all products from local Strapi if running
    const res = await fetch('http://localhost:1337/api/products?pagination[pageSize]=100');
    if (!res.ok) {
      console.log('Strapi server not running or not accessible at localhost:1337');
      return;
    }
    const data = await res.json();
    const products = data.data;

    let updatedCount = 0;
    for (const p of products) {
      if (p.name.toLowerCase().includes('tote') && p.type === 'luggage') {
        console.log(`Updating product: ${p.name} (ID: ${p.documentId || p.id})`);
        
        // In Strapi v5, we PUT to the documentId
        const putRes = await fetch(`http://localhost:1337/api/products/${p.documentId || p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { type: 'duffel' } })
        });

        if (putRes.ok) {
          updatedCount++;
        } else {
          console.error(`Failed to update ${p.name}`);
        }
      }
    }

    console.log(`Operation complete. Updated ${updatedCount} products.`);
  } catch (e) {
    console.error('Error connecting to Strapi:', e.message);
  }
}

fixTotes();
