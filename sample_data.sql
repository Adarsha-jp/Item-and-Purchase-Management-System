-- Optional sample data. Run after schema.sql:  mysql -u root -p item_purchase_db < sample_data.sql
USE item_purchase_db;

INSERT INTO item_types (type_name) VALUES
  ('Electronics'), ('Furniture'), ('Clothing'), ('Grocery'), ('Stationery');

INSERT INTO items (name, purchase_date, stock_available, item_type_id, active) VALUES
  ('Laptop',   '2026-08-01', 10, 1, 1),
  ('Mouse',    '2026-08-01', 20, 1, 1),
  ('Keyboard', '2026-08-02', 15, 1, 1),
  ('Chair',    '2026-08-03', 15, 2, 1),
  ('T-Shirt',  '2026-08-04',  4, 3, 1),
  ('Notebook', '2026-08-05',  0, 5, 1),
  ('Old Monitor', '2026-07-01', 6, 1, 0);
