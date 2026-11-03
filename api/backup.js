'use strict';

// Writes a consistent copy of the database to /data/backups while the API keeps running.
// Usage: docker compose exec api node backup.js

const fs = require('node:fs');
const path = require('node:path');
const { db, DATA_DIR } = require('./db');

const dir = path.join(DATA_DIR, 'backups');
const file = path.join(dir, `shop-${new Date().toISOString().substring(0, 10)}.db`);

fs.mkdirSync(dir, { recursive: true });
db.backup(file)
  .then(() => {
    console.log(file);
    db.close();
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
