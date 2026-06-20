# Day 2: Relational Infrastructure & Database Migrations

## 🎯 Objective
The goal of Day 2 was to establish a production-grade database environment. Instead of manually creating tables using a graphical interface (which is prone to human error and difficult to share across a team), we implemented **Code-First Infrastructure**. We containerized our database and used migration files to programmatically define our relational schema.

## 🏗️ Architecture & Tools Used
* **Docker & Docker Compose:** For containerized, isolated database hosting.
* **PostgreSQL:** An enterprise-grade relational database.
* **Node.js & Express (TypeScript):** The foundation of our backend API.
* **Knex.js:** A SQL query builder and migration management tool.

---

## 🛠️ Step-by-Step Implementation & Rationale

### 1. Database Containerization (Docker)
**What we did:** Created a `docker-compose.yml` file to spin up a PostgreSQL 15 container mapped to local port `5432` with persistent volumes.
**Why in industry:** Relying on local installations of databases (like installing Postgres directly onto Windows or Mac) causes version mismatches between developers ("It works on my machine" syndrome). Docker ensures that every developer, as well as the CI/CD pipeline and production server, runs the exact same database environment.

### 2. TypeScript & Knex Configuration
**What we did:** Initialized TypeScript in the `apps/api` directory and configured Knex to connect to the Docker container. We also resolved a critical module collision between Node's CommonJS (`module.exports`) and TypeScript's ES Modules (`export default`).
**Why in industry:** TypeScript catches runtime errors at compile time, saving countless hours of debugging. Knex allows us to write database queries and schemas in TypeScript, keeping our backend stack unified in a single language while providing security against SQL injection attacks.

### 3. Relational Schema Design (Migrations)
We created three sequential migration files to build our database architecture. *Order matters* here to ensure foreign key constraints are respected.

#### A. Users Table (`01_create_users`)
* **Design Choice - UUIDs:** We used Universally Unique Identifiers (UUIDs) instead of auto-incrementing integers (1, 2, 3...) for the Primary Key. This prevents hackers from guessing user IDs or scraping our database sequentially (Insecure Direct Object Reference vulnerabilities).
* **Roles:** Added a default `role` column to prepare for our upcoming Role-Based Access Control (RBAC) implementation.

#### B. Suppliers Table (`02_create_suppliers`)
* **Purpose:** Established the "One" side of our One-to-Many relationship (One supplier can have many products). 

#### C. Products Table (`03_create_products`)
* **Design Choice - Price in Cents:** We stored `price_cents` as an integer rather than a floating-point decimal (like `19.99`). Floating-point math in JavaScript is notoriously inaccurate (`0.1 + 0.2 = 0.30000000000000004`). Storing monetary values as integers (cents) completely eliminates rounding errors.
* **Foreign Key Constraint:** We linked `supplier_id` to the `suppliers` table. We implemented an `ON DELETE SET NULL` policy so that if a supplier is removed from the system, our product inventory isn't accidentally wiped out; the product simply becomes orphaned.

### 4. Migration Execution & Rollback Testing
**What we did:** Ran `npx knex migrate:latest` to build the database, followed immediately by `npx knex migrate:rollback`.
**Why in industry:** A deployment is only safe if you can undo it. Testing the rollback mechanism ensures that our `down` functions correctly drop the tables in reverse order. If a bad schema update is accidentally pushed to production, we now have a verified "undo" button to restore the system instantly.

---

## 💻 Key Commands Reference

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Boots the PostgreSQL database in the background. |
| `npx knex migrate:make <name>` | Generates a new timestamped migration file. |
| `npx knex migrate:latest` | Runs all pending migrations to build/update tables. |
| `npx knex migrate:rollback` | Reverses the last batch of migrations (drops tables). |

## 🚀 Next Steps
With the data layer structured and successfully tested, the next phase will involve seeding the database with dummy data and building out the secure Express API endpoints to perform CRUD operations on these tables.