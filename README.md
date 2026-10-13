# Item & Purchase Management System

Node.js + Express + MySQL web application for managing Item Types, Items, Purchases (multi-item orders), stock and purchase history. The frontend is plain HTML/CSS/JS served by the same Express server, so there is **one command to start everything**.

## Prerequisites
- Node.js 18+ (developed on 22)
- MySQL 8.0+ (MariaDB 10.5+ also works)
- npm

## 1. Install dependencies
```bash
npm install
```

## 2. Configure MySQL credentials
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=item_purchase_db
```

## 3. Create the database / run the schema
Pick one:
```bash
npm run db:setup          # creates DB + tables via Node (uses .env credentials)
npm run db:seed           # same + loads sample data (item types and items)
# or with the mysql client:
mysql -u root -p < schema.sql
mysql -u root -p item_purchase_db < sample_data.sql    # optional sample data
```
> `schema.sql` drops and recreates the four tables — don't re-run it on data you want to keep.

## 4. Start
```bash
npm start            # backend API + frontend  →  http://localhost:3000
npm run dev          # same, auto-restart on file changes (Node 18.11+)
```
There is no separate frontend server: open **http://localhost:3000**.

## Using the app
1. **Item Types** – add Electronics, Furniture, …
2. **Items** – create items (name, type, date, stock, Active/Inactive). View details, update, activate/deactivate, delete (only if never purchased).
3. **Create Purchase** – Order ID is pre-filled (`PO-00001`…), pick an item + quantity, *Add to order* (repeat), remove lines you don't want, *Submit Purchase*. Only Active items are selectable.
4. **Purchases** – list, *View Details*, *Update*. There is no delete button/endpoint for purchases.
5. **Stock** – In Stock (> 5), Low Stock (1–5), Out of Stock (0).

## Project structure
```
server.js            Express app, error handler, static hosting
db.js                MySQL connection pool
utils.js             validators, HttpError, stock status helper
routes/              itemTypes.js · items.js · purchases.js · stock.js
public/              index.html · style.css · app.js  (frontend)
schema.sql           database schema
sample_data.sql      optional sample data
scripts/setup-db.js  runs schema (+ sample data)
docs/API.md          API documentation
docs/postman_collection.json
```

## Design notes
- **Backend validation** for every rule in the assignment; the frontend only adds convenience checks.
- **Transactions:** purchase create/update run in one transaction (`BEGIN → lock + validate → insert → update stock → COMMIT`, `ROLLBACK` on any error). Item rows are locked with `SELECT … FOR UPDATE`, so simultaneous purchases can't oversell (verified: 12 parallel requests for 4 units → exactly 4 succeed).
- **Stock never negative:** checked in code *and* enforced by an `UNSIGNED` column.
- **Purchase update:** stock is adjusted by `new − old` per item (3 → 5 deducts 2; 5 → 2 returns 3).
- **No purchase deletion:** no DELETE route (a `DELETE` returns 405), no UI button, and the foreign keys use `ON DELETE RESTRICT`.
- **Item deletion:** blocked with 409 when the item is in any purchase; deactivate it instead. Inactive items stay visible in historical purchases.
- **Duplicate items in one order** are rejected (400), consistently on create and update.
- **Errors:** 400 / 404 / 405 / 409 with clear messages; unexpected errors return a generic 500 and are logged server-side only.
- **JOINs:** Item + Item Type, and Purchase + Purchase Items + Items + Item Types (see `docs/API.md`).

## Screenshots
Run the app, then capture these screens into a `screenshots/` folder: Item Types, Items list + form, Create Purchase (multiple lines), Purchase Details, an "Insufficient stock" error, and the Stock view.
