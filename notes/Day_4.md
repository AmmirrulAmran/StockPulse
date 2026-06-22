# Day 4 - Product CRUD and Validation

Day 4 added product CRUD routes and request validation.

CRUD means:

- Create
- Read
- Update
- Delete

For products, this means the backend can:

- Get all products.
- Create a new product.
- Update an existing product.
- Delete an existing product.

The big new idea today was validation. Before data reaches the controller and service, the backend checks whether the request data has the correct shape.

## Main Files

The Day 4 product flow uses these files:

```txt
apps/api/src/app.ts
apps/api/src/routes/product.routes.ts
apps/api/src/middlewares/validate.ts
apps/api/src/validators/validators.ts
apps/api/src/controllers/product.controller.ts
apps/api/src/services/product.services.ts
apps/api/src/db/connection/index.ts
```

## 1. app.ts

`app.ts` is where the product routes are connected to the Express app.

```ts
app.use("/api/v1/products", productRoutes);
```

This means any request that starts with:

```txt
/api/v1/products
```

will be sent into `product.routes.ts`.

Examples:

```txt
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

## 2. product.routes.ts

`product.routes.ts` decides which controller method should run for each product URL.

```ts
router.get("/", ProductController.getProducts);
router.post("/", validate(createProductSchema), ProductController.createProduct);
router.put("/:id", validate(updateProductSchema), ProductController.updateProduct);
router.delete("/:id", validate(deleteProductSchema), ProductController.deleteProduct);
```

The route file is like the traffic direction layer.

It says:

- `GET /` means get all products.
- `POST /` means create a product.
- `PUT /:id` means update one product.
- `DELETE /:id` means delete one product.

The `/:id` part is a route parameter.

For example:

```txt
PUT /api/v1/products/123
```

means:

```ts
req.params.id === "123"
```

## 3. validators.ts

`validators.ts` contains the rules for valid product data.

It defines three schemas:

```ts
createProductSchema
updateProductSchema
deleteProductSchema
```

Create needs a body because the client is sending new product data:

```txt
CREATE = body
```

Update needs params and body:

```txt
UPDATE = params + body
```

The params say which product to update.

The body says what data to change.

Delete only needs params:

```txt
DELETE = params
```

The params say which product to delete.

## 4. validate.ts

`validate.ts` is the reusable validation middleware.

The simple idea is:

```txt
validators.ts = the rules
validate.ts   = the rule checker
```

This middleware checks:

```ts
body: req.body,
query: req.query,
params: req.params,
```

If the request is valid, it calls:

```ts
next();
```

That lets the request continue to the controller.

If the request is invalid, it stops the request and returns:

```txt
400 Bad Request
```

That prevents bad data from reaching the controller or service.

## 5. product.controller.ts

`product.controller.ts` handles the HTTP response.

The controller does not directly write database queries.

Instead, it calls the service.

Example:

```ts
const products = await ProductService.getAllProducts();
```

Then it sends JSON back:

```ts
res.status(200).json({ success: true, data: products });
```

The controller is responsible for HTTP status codes:

- `200` means OK.
- `201` means created.
- `204` means deleted successfully with no response body.
- `404` means product not found.
- `500` means server error.

## 6. product.services.ts

`product.services.ts` talks to the database.

This file contains the actual Knex queries:

```ts
db("products").select("*")
db("products").insert(productData)
db("products").where({ id }).update(updateData)
db("products").where({ id }).del()
```

The service layer is where the database work happens.

It does not know about routes.

It does not know about HTTP responses.

It only knows how to get, create, update, and delete product records.

## 7. db/connection/index.ts

`db/connection/index.ts` creates the reusable database connection.

```ts
export const db = knex(config);
```

The product service imports this `db` object and uses it to query PostgreSQL.

This keeps the database connection in one place instead of creating it again in every service file.

## Product Request Flow

When the frontend or Postman sends this request:

```txt
POST /api/v1/products
```

with a JSON body:

```json
{
  "name": "Keyboard",
  "sku": "KEY123",
  "price_cents": 5000,
  "stock": 20,
  "supplier_id": "valid-supplier-uuid"
}
```

the flow is:

```txt
app.ts
  receives /api/v1/products

product.routes.ts
  matches POST /

validate.ts
  checks the request using createProductSchema

validators.ts
  defines what valid product data looks like

product.controller.ts
  handles the HTTP request and response

product.services.ts
  inserts the product into the database

db/connection/index.ts
  provides the Knex connection

PostgreSQL
  stores the new product
```

## Route Flow Summary

Get all products:

```txt
GET /api/v1/products
route -> controller -> service -> database
```

Create product:

```txt
POST /api/v1/products
route -> validate body -> controller -> service -> database
```

Update product:

```txt
PUT /api/v1/products/:id
route -> validate params and body -> controller -> service -> database
```

Delete product:

```txt
DELETE /api/v1/products/:id
route -> validate params -> controller -> service -> database
```

## Validation Example

Bad request:

```json
{
  "name": "A",
  "price_cents": -50
}
```

This should fail because:

- `name` is too short.
- `price_cents` cannot be negative.
- `sku` is missing.
- `stock` is missing.
- `supplier_id` is missing.

The backend should return:

```txt
400 Bad Request
```

This is useful because the backend rejects bad data before it reaches the database.

## End of Day 4 Result

By the end of Day 4:

- Zod was added for validation.
- Product validation schemas were created.
- A reusable validation middleware was created.
- Product routes were added.
- Product controller methods were added.
- Product service methods were added.
- Product CRUD now follows the same clean route, controller, service structure.

