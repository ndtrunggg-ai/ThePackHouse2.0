const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const products = [
  { sku: "3201165", name: "Medium Camera / Flash Camcorder Case", brand: "case-logic", quantity: 4, price: 500000, type: "accessory", specs: '["Camera", "Compact"]', description: "Túi đựng máy ảnh hoặc máy quay phim cỡ trung bình, bảo vệ thiết bị an toàn.", weight: "0.2 kg", origin: "USA" },
  { sku: "3201025", name: "Camera holster SLR", brand: "case-logic", quantity: 5, price: 600000, type: "accessory", specs: '["SLR", "Holster"]', description: "Túi đeo chéo đựng máy ảnh SLR, thiết kế lấy máy nhanh.", weight: "0.3 kg", origin: "USA" },
  { sku: "3203858", name: "Founder 26L backpack", brand: "case-logic", quantity: 83, price: 950000, type: "backpack", specs: '["26L", "Everyday"]', description: "Balo 26L đa năng dành cho sinh viên hoặc dân văn phòng.", weight: "0.6 kg", origin: "USA" },
  { sku: "3204238", name: "Commence 24L BP", brand: "case-logic", quantity: 533, price: 850000, type: "backpack", specs: '["24L", "Laptop"]', description: "Balo laptop 24L gọn nhẹ, có ngăn chống sốc.", weight: "0.5 kg", origin: "USA" },
  { sku: "3203780", name: "Spira 37L Weekender (Đỏ Rio)", brand: "thule", quantity: 20, price: 2490000, type: "duffel", specs: '["37L", "Travel"]', description: "Túi du lịch 37L rộng rãi, thiết kế thời trang cho những chuyến đi ngắn ngày.", weight: "1.1 kg", origin: "Sweden" },
  { sku: "3203786", name: "Spira Horizontal (Xanh Legion)", brand: "thule", quantity: 19, price: 1999000, type: "duffel", specs: '["Horizontal", "Travel"]', description: "Túi tote nằm ngang thanh lịch, hoàn hảo cho công việc và dạo phố.", weight: "0.9 kg", origin: "Sweden" },
  { sku: "3204491", name: "Paramount Convertible (Xanh lá đậm)", brand: "thule", quantity: 11, price: 1590000, type: "backpack", specs: '["Convertible", "Laptop"]', description: "Balo chuyển đổi đa năng, có thể xách tay hoặc đeo chéo.", weight: "1.0 kg", origin: "Sweden" },
  { sku: "3204145", name: "Spira SPAC-122 (Đỏ Rio)", brand: "thule", quantity: 17, price: 3950000, type: "luggage", specs: '["SPAC-122", "Spinner"]', description: "Vali kéo doanh nhân cao cấp, bánh xe trơn tru.", weight: "3.2 kg", origin: "Sweden" },
  { sku: "point 65(25lits)", name: "GTX 25L Hardshell", brand: "boblbee", quantity: 5, price: 7310000, type: "backpack", specs: '["25L", "Hardshell"]', description: "Balo vỏ cứng huyền thoại bảo vệ cột sống, thiết kế khí động học.", weight: "2.1 kg", origin: "Sweden" }
];

db.serialize(() => {
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

  db.run("DELETE FROM products"); // Clear existing for re-run

  const stmt = db.prepare(`INSERT INTO products (sku, name, brand, quantity, price, type, specs, description, weight, origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  for (const p of products) {
    stmt.run(p.sku, p.name, p.brand, p.quantity, p.price, p.type, p.specs, p.description, p.weight, p.origin);
  }
  
  stmt.finalize();
  console.log("Database initialized with sample products.");
});

db.close();
