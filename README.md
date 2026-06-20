# 📦 StockPulse

**A Production-Grade B2B SaaS Inventory & Order Management System**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?logo=docker&logoColor=white)

StockPulse is a full-stack, multi-tenant inventory management platform designed for B2B operations. It features strict relational data integrity, role-based access control (RBAC), secure JWT authentication, and automated CI/CD pipelines.

## ✨ Core Features
* **Inventory Management:** Track product stock levels, SKUs, and pricing natively in cents to prevent floating-point errors.
* **Order Processing:** ACID-compliant database transactions ensure inventory balances are perfectly synced with incoming orders.
* **Role-Based Access Control (RBAC):** Secure middleware protecting sensitive routes (Admin vs. Staff permissions).
* **Supplier Management:** Relational mapping between products and wholesale suppliers with cascading failsafes.
* **Production Telemetry:** Centralized JSON logging and global error boundaries.

## 🏗️ Tech Stack & Architecture

This project is structured as a **Monorepo** using npm workspaces, separating the frontend and backend while sharing core configurations and quality-control hooks.

### Frontend (`/apps/web`)
* **Framework:** React 18 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand (Global Session) & TanStack Query (Server State/Caching)
* **Form Validation:** React Hook Form + Zod

### Backend (`/apps/api`)
* **Server:** Node.js + Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (Containerized)
* **Query Builder / Migrations:** Knex.js
* **Security:** Helmet, CORS, bcrypt, JWT via HttpOnly Cookies
* **Validation:** Zod (Runtime Type Checking)

### DevOps & Infrastructure
* **Containerization:** Docker & Docker Compose
* **Version Control Hooks:** Husky + lint-staged + commitlint (Conventional Commits enforced)
* **Formatting:** Prettier + ESLint

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [Docker Desktop](https://www.docker.com/products/docker-desktop) (Must be running)
* Git

