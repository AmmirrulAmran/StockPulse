# Day 3 - Seeding and Backend Architecture

Day 3 connected the database work from Day 2 to a working Express backend.

The main goals were:

- Add realistic dummy data using Knex seeds and Faker.
- Create a reusable database connection.
- Organize the backend using routes, controllers, and services.
- Start an Express server with a health check and suppliers endpoint.

## 1. Seed Data

The seed file is:

```txt
apps/api/src/db/seeds/01_seed_core_data.ts
```

This file fills the database with test data.

It does three important things:

- Deletes old data from `products`, `suppliers`, and `users`.
- Creates 10 fake suppliers using Faker.
- Creates 50 fake products and connects each product to a random supplier.
- Creates one admin user.

Faker is used to generate realistic fake values like company names, emails, phone numbers, product names, SKUs, prices, and stock amounts.

The seed was run with:

```bash
npx knex seed:run
```

Before seeding, the migrations had to be reset and run again:

```bash
npx knex migrate:rollback --all
npx knex migrate:latest
npx knex seed:run
```

This fixed the issue where Knex thought the migrations were already complete, but the actual database tables did not exist.

## 2. Database Connection

The database connection file is:

```txt
apps/api/src/db/connection/index.ts
```

This file creates one reusable Knex connection:

```ts
export const db = knex(config);
```

Other backend files import `db` from here instead of creating a new database connection every time.

This keeps the database access centralized and easier to maintain.

## 3. Services Layer

The suppliers service file is:

```txt
apps/api/src/services/supplier.services.ts
```

The service layer is responsible for business logic and database queries.

For suppliers, the service has:

```ts
SupplierService.getAllSuppliers()
```

That method queries the `suppliers` table:

```ts
return db("suppliers").select("*").orderBy("name", "asc");
```

The important idea is that services do not care about HTTP requests or responses. They only handle the app logic and database work.

## 4. Controllers Layer

The suppliers controller file is:

```txt
apps/api/src/controllers/supplier.controller.ts
```

The controller layer handles the HTTP request and response.

For suppliers, the controller has:

```ts
SupplierController.getSuppliers()
```

This method:

- Calls `SupplierService.getAllSuppliers()`.
- Sends a `200` response with the suppliers data if it works.
- Sends a `500` response if something goes wrong.

Controllers should not directly write database queries. They should call services.

## 5. Routes Layer

The suppliers route file is:

```txt
apps/api/src/routes/supplier.routes.ts
```

The route layer connects a URL to a controller method.

This route:

```ts
router.get("/", SupplierController.getSuppliers);
```

means:

```txt
GET /api/v1/suppliers
```

should call:

```ts
SupplierController.getSuppliers
```

Routes should stay small. Their main job is to define endpoints and pass the request to the correct controller.

## 6. Express App

The Express app file is:

```txt
apps/api/src/app.ts
```

This file configures the Express application.

It does these things:

- Creates the Express app.
- Adds middleware.
- Mounts the suppliers routes.
- Adds a health check route.
- Exports the app.

The JSON middleware:

```ts
app.use(express.json());
```

allows Express to read JSON request bodies and place them in `req.body`.

The suppliers route is mounted here:

```ts
app.use("/api/v1/suppliers", supplierRoutes);
```

That means the routes inside `supplier.routes.ts` live under:

```txt
/api/v1/suppliers
```

The health check route is:

```txt
GET /health
```

This is used to quickly confirm the backend is running.

## 7. Server Entry Point

The server file is:

```txt
apps/api/src/server.ts
```

This file starts the backend server.

It imports the Express app:

```ts
import app from "./app";
```

Then it listens on a port:

```ts
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

The difference between `app.ts` and `server.ts` is:

- `app.ts` defines and configures the Express app.
- `server.ts` starts the app by listening on a port.

Keeping them separate makes the app easier to test and organize.

## 8. Request Flow

When the browser visits:

```txt
http://localhost:5000/api/v1/suppliers
```

the request flows like this:

```txt
server.ts
  starts the backend on port 5000

app.ts
  receives the request and sends /api/v1/suppliers to supplierRoutes

supplier.routes.ts
  matches GET / and calls SupplierController.getSuppliers

supplier.controller.ts
  calls SupplierService.getAllSuppliers and returns JSON

supplier.services.ts
  queries the database using db

db/connection/index.ts
  provides the Knex database connection

PostgreSQL
  returns the suppliers data
```

The response comes back as JSON.

## 9. Dev Server

The dev server is started from:

```txt
apps/api
```

using:

```bash
npm run dev
```

The script uses `ts-node-dev` so the backend restarts automatically when files change.

## End of Day 3 Result

By the end of Day 3:

- The database had realistic fake data.
- The backend had a clean 3-layer architecture.
- The suppliers endpoint was connected from route to controller to service to database.
- The Express app could run on port `5000`.
- The health check and suppliers endpoint could be tested in the browser.

