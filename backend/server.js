const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Serve static images
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Database initialization
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  else {
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      quantity INTEGER DEFAULT 0,
      price INTEGER DEFAULT 0,
      image_url TEXT,
      type TEXT DEFAULT 'backpack',
      specs TEXT,
      description TEXT,
      weight TEXT,
      origin TEXT
    )`);
  }
});

// GET all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse specs if it's a JSON string
    rows = rows.map(r => ({
      ...r,
      specs: r.specs ? JSON.parse(r.specs) : []
    }));
    res.json(rows);
  });
});

// POST add a product
app.post('/api/products', (req, res) => {
  const { sku, name, brand, quantity, price, image_url, type, specs, description, weight, origin } = req.body;
  const specStr = specs ? JSON.stringify(specs) : '[]';
  db.run(`INSERT INTO products (sku, name, brand, quantity, price, image_url, type, specs, description, weight, origin) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [sku, name, brand, quantity, price, image_url, type, specStr, description, weight, origin],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// PUT update a product
app.put('/api/products/:id', (req, res) => {
  const { quantity, price, image_url, description, weight, origin } = req.body;
  const updates = [];
  const values = [];
  if (quantity !== undefined) { updates.push("quantity = ?"); values.push(quantity); }
  if (price !== undefined) { updates.push("price = ?"); values.push(price); }
  if (image_url !== undefined) { updates.push("image_url = ?"); values.push(image_url); }
  if (description !== undefined) { updates.push("description = ?"); values.push(description); }
  if (weight !== undefined) { updates.push("weight = ?"); values.push(weight); }
  if (origin !== undefined) { updates.push("origin = ?"); values.push(origin); }
  
  if (updates.length === 0) return res.json({ success: true });
  
  values.push(req.params.id);
  const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// POST upload image for product
app.post('/api/products/:id/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  db.run("UPDATE products SET image_url = ? WHERE id = ?", [imageUrl, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, image_url: imageUrl });
  });
});

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));

// ─── ZALOPAY INTEGRATION ────────────────────────────────────────────────────
const ZALOPAY = {
  appid: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Yd2ufjx',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  query_endpoint: 'https://sb-openapi.zalopay.vn/v2/query',
};

// POST /api/zalopay/create-order
app.post('/api/zalopay/create-order', async (req, res) => {
  try {
    const { amount, items, description, callback_url, redirect_url } = req.body;
    const appTransId = new Date().toISOString().slice(2, 10).replace(/-/g, '') + '_' + Date.now();
    const appTime = Date.now();

    const order = {
      appid: ZALOPAY.appid,
      apptransid: appTransId,
      appuser: 'packhouse_user',
      apptime: appTime,
      amount: amount,
      item: JSON.stringify(items || []),
      embeddata: JSON.stringify({ redirecturl: redirect_url || 'http://localhost:5000/checkout.html' }),
      description: description || 'The Pack House - Thanh toán đơn hàng',
      bankcode: '',
      callback_url: callback_url || '',
    };

    // HMAC: appid|apptransid|appuser|amount|apptime|embeddata|item
    const data = [
      order.appid,
      order.apptransid,
      order.appuser,
      order.amount,
      order.apptime,
      order.embeddata,
      order.item
    ].join('|');

    order.mac = crypto.createHmac('sha256', ZALOPAY.key1).update(data).digest('hex');

    const params = new URLSearchParams();
    Object.entries(order).forEach(([k, v]) => params.append(k, v));

    const response = await axios.post(ZALOPAY.endpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    res.json({ ...response.data, apptransid: appTransId });
  } catch (err) {
    console.error('ZaloPay create order error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/zalopay/callback  (ZaloPay calls this after payment)
app.post('/api/zalopay/callback', (req, res) => {
  const { data, mac } = req.body;
  const expectedMac = crypto.createHmac('sha256', ZALOPAY.key2).update(data).digest('hex');
  if (mac !== expectedMac) {
    return res.json({ returncode: -1, returnmessage: 'mac not equal' });
  }
  const parsed = JSON.parse(data);
  console.log('ZaloPay callback - order paid:', parsed.apptransid);
  res.json({ returncode: 1, returnmessage: 'success' });
});

// GET /api/zalopay/query-order?apptransid=...
app.get('/api/zalopay/query-order', async (req, res) => {
  try {
    const { apptransid } = req.query;
    const reqtime = Date.now();
    const data = ZALOPAY.appid + '|' + apptransid + '|' + ZALOPAY.key1;
    const mac = crypto.createHmac('sha256', ZALOPAY.key1).update(data).digest('hex');
    const params = new URLSearchParams({ appid: ZALOPAY.appid, apptransid, reqtime, mac });
    const response = await axios.post(ZALOPAY.query_endpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
