CREATE DATABASE lozando;

-- Motivation behind usage of ENUMs:
-- 1) stored compactly in memory since they're represented internally by
-- small integer values;
-- 2) don't take part in relationshipt;
-- 3) reraly modified data, no need in frequent select/insert/update/delete.
CREATE TYPE color_t AS ENUM (
  'black', 'brown', 'beige', 'grey', 'white', 'blue', 'petrol', 'turquoise',
  'green', 'olive', 'yellow', 'orange', 'red', 'pink', 'lilac', 'gold',
  'silver', 'multi-coloured'
);

CREATE TYPE clothing_size_t AS ENUM ('xs', 's', 'm', 'l', 'xl', 'xll');
CREATE TYPE shoes_size_t AS ENUM ('40', '41', '42', '43', '44', '45');

CREATE TYPE order_status_t AS ENUM (
  'pending', 'in_progress', 'waiting_for_pick_up', 'shipped', 'delivered'
);


-- PostgreSQL automatically creates INDEX for:
-- -- PRIMARY KEY constraint: btree
-- -- UNIQUE constraint: btree
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) UNIQUE NOT NULL
);


CREATE TABLE discounts (
  id SERIAL PRIMARY KEY,
  procentage DECIMAL(5,1) UNIQUE NOT NULL
);


CREATE TABLE clothing_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) UNIQUE NOT NULL,
  for_men BOOLEAN NOT NULL,
  for_women BOOLEAN NOT NULL,
  CHECK (for_men OR for_women)
);


CREATE TABLE shoes_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) UNIQUE NOT NULL,
  for_men BOOLEAN NOT NULL,
  for_women BOOLEAN NOT NULL,
  CHECK (for_men OR for_women)
);


CREATE TABLE clothing_products (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(40) NOT NULL,
  description TEXT,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  category_id INTEGER NOT NULL REFERENCES clothing_categories(id),
  size clothing_size_t NOT NULL,
  color color_t NOT NULL,
  for_men BOOLEAN NOT NULL,
  for_women BOOLEAN NOT NULL,
  price DECIMAL(7, 2) NOT NULL,
  discount INTEGER REFERENCES discounts(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (brand_id, category_id, model_name, size, color, for_men, for_women),
  CHECK (for_men OR for_women)
);


CREATE TABLE shoes_products (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(40) NOT NULL,
  description TEXT,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  category_id INTEGER NOT NULL REFERENCES shoes_categories(id),
  size shoes_size_t NOT NULL,
  color color_t NOT NULL,
  for_men BOOLEAN NOT NULL,
  for_women BOOLEAN NOT NULL,
  price DECIMAL(7, 2) NOT NULL,
  discount INTEGER REFERENCES discounts(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (brand_id, category_id, model_name, size, color, for_men, for_women),
  CHECK (for_men OR for_women)
);


CREATE TABLE clothing_inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES clothing_products(id) ON DELETE CASCADE,
  stock INT NOT NULL CHECK (stock >= 0),
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE shoes_inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES shoes_products(id) ON DELETE CASCADE,
  stock INT NOT NULL CHECK (stock >= 0),
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status order_status_t NOT NULL DEFAULT 'pending'
);


CREATE TABLE order_items_clothing (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES clothing_products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (order_id, product_id)
);


CREATE TABLE order_items_shoes (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES shoes_products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  UNIQUE (order_id, product_id)
);


CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-------------
-- INDEXes --
-------------
CREATE INDEX idx_clothing_products_brand_id ON clothing_products (brand_id);
CREATE INDEX idx_clothing_products_category_id ON clothing_products (category_id);

CREATE INDEX idx_shoes_products_brand_id ON shoes_products (brand_id);
CREATE INDEX idx_shoes_products_category_id ON shoes_products (category_id);

CREATE INDEX idx_clothing_inventory_product_id ON clothing_inventory (product_id);

CREATE INDEX idx_shoes_inventory_product_id ON shoes_inventory (product_id);


--------------
-- TRIGGERs --
--------------
CREATE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clothing_inventory_last_updated
BEFORE UPDATE ON clothing_inventory
FOR EACH ROW
EXECUTE FUNCTION update_last_updated();

CREATE TRIGGER update_shoes_inventory_last_updated
BEFORE UPDATE ON shoes_inventory
FOR EACH ROW
EXECUTE FUNCTION update_last_updated();