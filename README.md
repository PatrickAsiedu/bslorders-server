# BSLOrders

## Description

BSLOrders is a modern web application for managing lunch orders at Broadspectrum Ltd. Built with React, Redux, and Tailwind CSS, it provides a seamless experience for users, chefs, and administrators to place, manage, and review daily food and drink orders.

## Motivation

At Broadspectrum, where all employees are entitled to lunch, the use of Microsoft Forms for order placement resulted in tampered orders, increased company costs, and added complexity for chefs. BSLOrders is an authenticated web-based application designed to reduce company costs by preventing unauthorized orders, ensuring order accuracy for employees, and simplifying the process for chefs, thereby improving efficiency and user experience.

## Quick Start

### Visit the Live Demo OR Skip to Installation Guide

You can access the live demo version of BSLOrders here:  
[https://bslorders-client.vercel.app](https://bslorders-client.vercel.app/)

### Installation Guide

### Clone repository

### Setup Server

You can find the backend/server code here:  
[https://github.com/PatrickAsiedu/bslorders-server](https://github.com/PatrickAsiedu/bslorders-server)


### Setup Client

```bash
git clone https://github.com/PatrickAsiedu/bslorders-client.git
cd bslorders-client
```

```sh
npm install
```

### Start Development Server

```sh
npm start
```



### Features

- Authentication: JWT-based login and role-based access (admin, chef, user).
- Menu management: chefs/admins can create, edit, and delete daily menus (foods & drinks).
- Ordering: authenticated users can place, edit, and delete a single order per menu.
- Daily exports: scheduled cron job generates a CSV of orders for a menu date.
- User management: admins can approve, block, reset passwords, and list users.
- Soft-delete for items: food/drink items are soft-deleted via status flags.
- Database: MySQL (original project uses MySQL / MariaDB). The server can be refactored to Postgres but default schema and dumps are MySQL-compatible.

### Usage

1. Create a copy of the `.env` file at the project root and set these variables:

```
DB_host=localhost
DB_user=root
DB_password=your_mysql_password
DB_name=bsl_orders
DB_port=3306
SERVER_PORT=3001
SECRET_OR_KEY='your_jwt_secret'
cronTime=7
```

2. Install dependencies and start the server (from project root):

```bash
npm install
npm run dev   # uses nodemon, or `npm start` for production
```

3.  Initialize the database (MySQL/MariaDB):

- Option A: Use the provided `bslorders.sql` (MySQL dump) to create tables and seed data. Example using the MySQL client:

```bash
 # from a shell where `mysql` is available
 mysql -u root -p bsl_orders < bslorders.sql
```

- Option B: If you are creating schema manually, use `bslorders.sql` as the reference. The dump includes table definitions, initial rows, primary keys, and AUTO_INCREMENT settings.

```sql
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('food_id_seq', (SELECT COALESCE(MAX(id), 1) FROM food));
-- repeat for other sequences (drink_id_seq, menu_id_seq, orders_id_seq)
```

4. Important endpoints (backend):

- POST /api/auth/login — login, returns JWT token
- POST /api/auth/register — register a new user (pending approval)
- GET /api/menu — get today's/tomorrow's menu
- POST /api/menu — create a new menu (admin/chef)
- POST /api/orders — place an order (authenticated users)
- GET /api/orders/daily — get orders for a date (admin/chef)
- GET /api/users — list users (admin/chef)

5. Cron job & CSV export

- The app contains a cron job (`utils/cron-jobber.js`) that generates CSVs for a given menu date. Configure `cronTime` in `.env` if needed.

6. Notes & troubleshooting

- If you see `Table 'users' doesn't exist` or similar MySQL errors, the MySQL schema wasn't imported. Run `bslorders.sql` against your MySQL/MariaDB instance.
- If you get duplicate key errors on `id` after importing, ensure AUTO_INCREMENT counters are set: the dump includes ALTER TABLE ... AUTO_INCREMENT statements to set the next id.
- If you want to run the project with PostgreSQL, I can provide a separate PG migration and updated README sections — ask and I will add it.

If you'd like, I can also add a short list of environment-specific sample `DB_URL` strings for Render/Heroku.
