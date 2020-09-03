CREATE TABLE IF NOT EXISTS sellers (
	seller_id SERIAL PRIMARY KEY,
	username TEXT,
	password TEXT,
	details TEXT,
	role TEXT);

CREATE TABLE IF NOT EXISTS buyers (
	buyer_id SERIAL PRIMARY KEY,
	username TEXT,
	password TEXT,
	details TEXT,
	role TEXT);

CREATE TABLE IF NOT EXISTS orders (
	order_id SERIAL PRIMARY KEY,
	seller_id INTEGER,
	buyer_id INTEGER,
	sale_id INTEGER,
	object_id INTEGER);

CREATE TABLE IF NOT EXISTS sales (
	sale_id SERIAL PRIMARY KEY,
	seller_id INTEGER,
	time_live INTEGER,
	sold_out BOOLEAN);

CREATE TABLE IF NOT EXISTS catalogue (
	item_id SERIAL PRIMARY KEY,
	price NUMERIC(10,2),
	product_desc TEXT,
	image_url TEXT,
	seller_id INTEGER);