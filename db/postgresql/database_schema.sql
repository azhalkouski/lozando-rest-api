CREATE TYPE gender_t AS ENUM ('women', 'men');
CREATE TYPE product_categories_aggregation_group_t AS ENUM ('clothing', 'shoes');

CREATE TABLE genders (
  id SERIAL PRIMARY KEY,
  name gender_t UNIQUE NOT NULL
);

-- `clothing` is an aggregation of product_categories such as `dresses`, `shirts`, etc
CREATE TABLE product_categories_aggregation_groups (
  id SERIAL PRIMARY KEY,
  name product_categories_aggregation_group_t UNIQUE NOT NULL
);

CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL,
  aggregation_group_id INT NOT NULL REFERENCES product_categories_aggregation_groups(id)
);

CREATE TABLE product_sub_categories (
  id SERIAL PRIMARY KEY,
  product_category_id INT NOT NULL REFERENCES product_categories(id),
  name VARCHAR(30) NOT NULL,
  -- why UNIQUE CONSTRAINT ON product_category_id, name?
  -- because t-shirts->polo and sportwear -> polo. I can't make polo be unique
  UNIQUE (product_category_id, name)
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pattern_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) UNIQUE NOT NULL
);

CREATE TABLE collar_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE neckline_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE multipacks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE sleeve_length_codes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- ! CREATE TABLE clothing_length_codes (
CREATE TABLE fit_length_codes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE lining_materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE upper_lower_wear_sizes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE feet_sizes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE shape_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE fit_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE specialty_sizes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL
);


CREATE TABLE trouser_rise_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE occasion_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE fashion_collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE fastening_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE products_catalog (
  id SERIAL,
  article_number VARCHAR(13) PRIMARY KEY,
  product_category_id INT NOT NULL REFERENCES product_categories(id),
  product_sub_category_id INT NOT NULL REFERENCES product_sub_categories(id),
  gender_id INT NOT NULL REFERENCES genders(id),
  is_for_kids BOOLEAN NOT NULL DEFAULT FALSE,
  brand_id INT NOT NULL REFERENCES brands(id),
  name VARCHAR(40) NOT NULL,
  sizes JSONB NOT NULL,
  color_id INT NOT NULL REFERENCES colors(id),
  pattern_type_id INT REFERENCES pattern_types(id),
  neckline_type_id INT REFERENCES neckline_types(id),
  collar_type_id INT REFERENCES collar_types(id),
  materials JSONB NOT NULL,
  sleeve_length_code_id INT REFERENCES sleeve_length_codes(id),
  shape_type_id INT REFERENCES shape_types(id),
  fit_type_id INT REFERENCES fit_types(id),
  fit_length_code_id INT REFERENCES fit_length_codes(id),
  -- 88.4 cm (Size S) - when it is REALLY SHORT and it is necessary to be conveyed
  total_length VARCHAR(50),
  trouser_rise_type_id INT REFERENCES trouser_rise_types(id),
  fastening_type_id INT REFERENCES fastening_types(id),
  multipack_id INT REFERENCES multipacks(id),
  pockets VARCHAR(50),
  -- example of qualities: down coat is water-repellent
  qualities VARCHAR(50),
  back_width VARCHAR(50),
  hood_detail VARCHAR(50),
  specialty_size_id INT REFERENCES specialty_sizes(id),
  occasion_type_id INT REFERENCES occasion_types(id),
  style_id INT REFERENCES styles(id),
  -- example of a cut: asymmetrical (regarding shoulders)
  cut_type VARCHAR(50),
  collection_id INT REFERENCES fashion_collections(id),
  -- example of additional_details "Belt indluded" for a dress with a belt
  additional_details VARCHAR(50),
  purchase_price MONEY,
  CHECK(sizes ? 'sizes')
);


CREATE TABLE discounts (
  id SERIAL PRIMARY KEY,
  label CHAR(3) NOT NULL,
  value DECIMAL(3,2) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  article_number VARCHAR(13) NOT NULL REFERENCES products_catalog(article_number),
  size VARCHAR(10) NOT NULL,
  stock INT NOT NULL,
  -- `selling_price_before_discount` depends on availability, demand level ,etc.
  -- and it is usually differs from the purchase_price
  selling_price_before_discount MONEY,
  discount_id INT REFERENCES discounts(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- TRIGGER on updated_at `update_inventory_updated_at`
  updated_at TIMESTAMP NOT NULL,
  -- UNIQUE CONSTRAINT on (article_number, size) because model+color+size = distinct unit
  -- which can be in hight demand AND low availbaility, and we want to increase the
  -- price, OR it is in low demand we rather apply a discount and get rid of it
  -- article_number is unique for model and its color. One distinct model of two
  -- different colors => two distinct article_number(s)
  UNIQUE (article_number, size)
);

CREATE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_last_updated();
