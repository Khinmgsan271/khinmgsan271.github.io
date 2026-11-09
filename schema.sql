-- Fictional e-commerce database schema, educational demonstration only.
-- SQLite 3 compatible. No personal, payment, wallet or identity information.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS products (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 category TEXT NOT NULL,
 price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
 active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1))
);
CREATE TABLE IF NOT EXISTS demo_orders (
 id INTEGER PRIMARY KEY,
 created_at TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('draft','simulated','cancelled'))
);
CREATE TABLE IF NOT EXISTS demo_order_items (
 order_id INTEGER NOT NULL REFERENCES demo_orders(id) ON DELETE CASCADE,
 product_id TEXT NOT NULL REFERENCES products(id),
 quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 20),
 PRIMARY KEY(order_id,product_id)
);
INSERT OR IGNORE INTO products(id,title,category,price_cents) VALUES
 ('vase','Solstice Vase','Homeware',3800),
 ('lamp','Arc Table Lamp','Workspace',7400),
 ('notes','Studio Notebook','Workspace',1800),
 ('clock','Nordic Clock','Homeware',4900),
 ('cup','Stoneware Cup','Homeware',2200),
 ('bag','Everyday Tote','Accessories',2700),
 ('plant','Clover Planter','Homeware',3300),
 ('case','Minimal Pouch','Accessories',2500);
INSERT OR IGNORE INTO demo_orders(id,created_at,status) VALUES (1,'2026-09-07','simulated'),(2,'2026-09-08','draft');
INSERT OR IGNORE INTO demo_order_items(order_id,product_id,quantity) VALUES (1,'vase',2),(1,'cup',1),(2,'lamp',1);
