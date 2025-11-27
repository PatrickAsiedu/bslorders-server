
-- PostgreSQL compatible schema and data for bslorders
-- Fixed version: DATE -> TIMESTAMP, nullable comment, CASCADE deletes

-- Table: drink
CREATE TABLE drink (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

INSERT INTO drink (id, name, created_at, updated_at) VALUES
(2, 'Millet drink', '2022-02-14 00:00:00', '2022-02-25 11:06:47');

-- Table: food
CREATE TABLE food (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

INSERT INTO food (id, name, created_at, updated_at) VALUES
(3, 'Waakye', '2022-02-05 15:52:09', '2022-02-23 17:06:54');

-- Table: menu
CREATE TABLE menu (
    id INTEGER PRIMARY KEY,
    expires_at DATE NOT NULL,
    menu_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_by TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Table: menu_food
CREATE TABLE menu_food (
    menu_id INTEGER NOT NULL REFERENCES menu(id) ON DELETE CASCADE,
    food_id INTEGER NOT NULL REFERENCES food(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Table: menu_drink
CREATE TABLE menu_drink (
    menu_id INTEGER NOT NULL REFERENCES menu(id) ON DELETE CASCADE,
    drink_id INTEGER NOT NULL REFERENCES drink(id) ON DELETE CASCADE,
    drink_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Table: users
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(1000) NOT NULL,
    phone_number TEXT NOT NULL,
    password TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATE NOT NULL
);

INSERT INTO users (id, name, phone_number, password, type, status, created_at) VALUES
(1, 'John Mensah', '0500000000', '$2a$12$90MbFBgHvt/HR6Wgx7u51eDNbAh8bZnfCTZD7YJFo61hbqVrlmdUS', 'admin','ACTIVE', '2022-02-21'),
(2, 'Joel the Cheff', '0200000000', '$2a$12$T2SILsCdjJuH1Gf4QJ5LmeVLJsD5/i3o4Z1aVBvPj2S.H7EF02nHS', 'chef','ACTIVE', '2022-02-21');

-- Table: orders
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    food_id INTEGER NOT NULL REFERENCES food(id) ON DELETE RESTRICT,
    food_name VARCHAR(255) NOT NULL,
    drink_id INTEGER NOT NULL REFERENCES drink(id) ON DELETE RESTRICT,
    drink_name VARCHAR(255) NOT NULL,
    menu_id INTEGER NOT NULL REFERENCES menu(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_menu_food_menu_id ON menu_food(menu_id);
CREATE INDEX idx_menu_food_food_id ON menu_food(food_id);
CREATE INDEX idx_menu_drink_menu_id ON menu_drink(menu_id);
CREATE INDEX idx_menu_drink_drink_id ON menu_drink(drink_id);
CREATE INDEX idx_orders_menu_id ON orders(menu_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_food_id ON orders(food_id);
CREATE INDEX idx_orders_drink_id ON orders(drink_id);
CREATE INDEX idx_users_phone_number ON users(phone_number);

-- Sequences for auto-increment
CREATE SEQUENCE IF NOT EXISTS drink_id_seq OWNED BY drink.id;
SELECT setval('drink_id_seq', COALESCE((SELECT MAX(id) FROM drink), 1));
ALTER TABLE drink ALTER COLUMN id SET DEFAULT nextval('drink_id_seq');

CREATE SEQUENCE IF NOT EXISTS food_id_seq OWNED BY food.id;
SELECT setval('food_id_seq', COALESCE((SELECT MAX(id) FROM food), 1));
ALTER TABLE food ALTER COLUMN id SET DEFAULT nextval('food_id_seq');

CREATE SEQUENCE IF NOT EXISTS menu_id_seq OWNED BY menu.id;
SELECT setval('menu_id_seq', COALESCE((SELECT MAX(id) FROM menu), 1));
ALTER TABLE menu ALTER COLUMN id SET DEFAULT nextval('menu_id_seq');

CREATE SEQUENCE IF NOT EXISTS orders_id_seq OWNED BY orders.id;
SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 1));
ALTER TABLE orders ALTER COLUMN id SET DEFAULT nextval('orders_id_seq');

CREATE SEQUENCE IF NOT EXISTS users_id_seq OWNED BY users.id;
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

COMMIT;
