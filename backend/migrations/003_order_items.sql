SET search_path TO rlabs;

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
