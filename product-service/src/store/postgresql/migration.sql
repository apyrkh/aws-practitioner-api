DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4 (),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS stocks (
  product_id UUID REFERENCES Products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  count INT NOT NULL,
  PRIMARY KEY(product_id)
);

INSERT INTO products (title, description, price)
values (
  'Product 1',
  'Product 1 description',
  1000
),
(
  'Product 2',
  'Product 2 description',
  2000
),
(
  'Product 3',
  'Product 3 description',
  3000
);

INSERT INTO stocks (product_id, count)
VALUES (
  (SELECT id from products WHERE title='Product 1'),
  5
),
(
  (SELECT id from products WHERE title='Product 2'),
  10
),
(
  (SELECT id from products WHERE title='Product 3'),
  15
);

-- select * FROM products LEFT JOIN stocks ON products.id = stocks.product_id;
