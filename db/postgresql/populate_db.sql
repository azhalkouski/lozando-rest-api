-- populate brands table
INSERT INTO brands (name) VALUES
  ('Brand A'),
  ('Brand B'),
  ('Brand C'),
  ('Brand D'),
  ('Brand E'),
  ('Brand F'),
  ('Brand G'),
  ('Brand H'),
  ('Brand I'),
  ('Brand K');


INSERT INTO clothing_categories (name, for_men, for_women) VALUES
  ('blouses', FALSE, TRUE),
  ('dresses', FALSE, TRUE),
  ('tops', FALSE, TRUE),
  ('shirts', TRUE, TRUE),
  ('t-shirts', TRUE, TRUE),
  ('knitwear', TRUE, TRUE),
  ('cardigans', TRUE, TRUE),
  ('jackets', TRUE, TRUE),
  ('coats', TRUE, TRUE),
  ('jeans', TRUE, TRUE),
  ('trousers', TRUE, TRUE),
  ('sportswear', TRUE, TRUE),
  ('sweatshirts', TRUE, TRUE),
  ('hoodies', TRUE, TRUE),
  ('suits', TRUE, TRUE),
  ('polo', TRUE, TRUE);


INSERT INTO shoes_categories (name, for_men, for_women) VALUES
  ('sneakers', TRUE, TRUE),
  ('sports_shoes', TRUE, TRUE),
  ('outdoor_shoes', TRUE, TRUE),
  ('boots', TRUE, TRUE),
  ('ankle_boots', FALSE, TRUE),
  ('pumps', FALSE, TRUE),
  ('flat_shoes', FALSE, TRUE),
  ('high_heels', FALSE, TRUE),
  ('sandals', FALSE, TRUE),
  ('mules', FALSE, TRUE),
  ('house_shoes', FALSE, TRUE),
  ('ballerinas', FALSE, TRUE),
  ('bridal_shoes', FALSE, TRUE),
  ('beach_shoes', FALSE, TRUE),
  ('lace-up_shoes', TRUE, FALSE),
  ('business_shoes', TRUE, FALSE),
  ('loafers', TRUE, FALSE),
  ('open_shoes', TRUE, FALSE),
  ('slippers', TRUE, FALSE);
