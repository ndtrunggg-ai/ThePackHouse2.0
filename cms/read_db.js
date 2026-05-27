const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db');
const rows = db.prepare("SELECT * FROM products").all();
console.log(rows);
db.close();
