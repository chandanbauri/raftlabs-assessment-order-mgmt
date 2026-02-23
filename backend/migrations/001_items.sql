CREATE SCHEMA IF NOT EXISTS rlabs;
SET search_path TO rlabs;

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT
);
