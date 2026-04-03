# MO Marketplace — Full-Stack Engineer Assessment

A full-stack product marketplace built with **NestJS** (backend) and **React + Vite** (frontend), featuring JWT authentication, product management with variants, and a Quick Buy flow.

---

## Architecture

```
mo-marketplace/
├── mo-marketplace-api/    # NestJS backend (Port 3000)
│   └── src/
│       ├── auth/          # JWT auth — register, login, strategy, guard
│       ├── users/         # User entity & service
│       ├── products/      # Products CRUD with variant support
│       ├── variants/      # Variant CRUD + combination_key logic
│       ├── common/        # Global exception filter
│       └── config/        # DB & JWT config helpers
└── mo-marketplace-web/    # React + Vite frontend (Port 5173)
    └── src/
        ├── api/           # Axios client + auth/products API helpers
        ├── components/    # Navbar, VariantSelector, QuickBuy, ProductCard
        ├── pages/         # ProductList, ProductDetail, Create, Login, Register
        ├── store/         # AuthContext (JWT persistence)
        └── types/         # Shared TypeScript types
```

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | NestJS, TypeORM, PostgreSQL, Passport JWT       |
| Validation| class-validator, class-transformer (backend) · Zod + react-hook-form (frontend) |
| Auth      | JWT (Bearer token), bcryptjs password hashing   |
| Frontend  | React 18, Vite, TypeScript, React Router v6     |
| HTTP      | Axios with request interceptors                 |
| Docs      | Swagger UI at `/api`                            |

---

## Prerequisites

- Node.js **v16+** (tested on v16.20.2)
- npm v8+
- PostgreSQL 15+ (or use the provided DigitalOcean instance)

---

## Setup & Run

### Backend

```bash
cd mo-marketplace-api
cp .env.example .env    # Edit with your DB credentials
npm install
npm run start:dev       # http://localhost:3000
                        # Swagger: http://localhost:3000/api
```

#### Environment Variables

```env
PORT=3000
NODE_ENV=development

DB_HOST=your-postgres-host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=mo_marketplace
DB_SSL=false            # Set true for cloud DBs (e.g. DigitalOcean)

JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```

> TypeORM runs with `synchronize: true` — tables are auto-created on first run.

### Frontend

```bash
cd mo-marketplace-web
cp .env .env.local      # Edit VITE_API_BASE_URL if needed
npm install
npm run dev             # http://localhost:5173
```

---

## API Reference

### Auth

| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| POST   | `/auth/register`  | —    | Register new user    |
| POST   | `/auth/login`     | —    | Login, returns JWT   |

### Products

| Method | Endpoint          | Auth     | Description                      |
|--------|-------------------|----------|----------------------------------|
| GET    | `/products`       | Public   | List all products with variants  |
| GET    | `/products/:id`   | Public   | Get single product               |
| POST   | `/products`       | Required | Create product (+ variants)      |
| PATCH  | `/products/:id`   | Required | Update product                   |
| DELETE | `/products/:id`   | Required | Delete product (cascade)         |

### Variants

| Method | Endpoint                              | Auth     | Description         |
|--------|---------------------------------------|----------|---------------------|
| GET    | `/products/:id/variants`              | Public   | List variants       |
| POST   | `/products/:id/variants`              | Required | Add variant         |
| PATCH  | `/products/:id/variants/:vid`         | Required | Update variant      |
| DELETE | `/products/:id/variants/:vid`         | Required | Remove variant      |

Full interactive docs: **http://localhost:3000/api** (Swagger UI)

---

## Key Features & Decisions

### combination_key Generation
Each variant generates a slug from its attributes: `color-size-material` (e.g. `red-m-cotton`). This allows O(1) duplicate detection per product. Empty attributes are omitted; variants with no attributes default to `"default"`.

### Duplicate Prevention
Before inserting a variant, the service queries by `(productId, combinationKey)`. If found, it returns HTTP 409 with a descriptive message naming the conflicting key.

### Out-of-Stock UI
Variants with `stock === 0` are rendered with a strikethrough style and disabled. The "Quick Buy" button is disabled if no in-stock variant is selected.

### JWT Flow
- Passwords hashed with bcrypt (10 rounds)
- Token stored in `localStorage`, attached via Axios request interceptor
- 401 responses auto-redirect to `/login` and clear stored credentials

### Validation
- Backend: `class-validator` + `ValidationPipe(whitelist: true)` on all DTOs
- Frontend: Zod schemas with `react-hook-form` on all forms

---

## Edge Cases Handled

| Scenario                          | Handling                                                   |
|-----------------------------------|------------------------------------------------------------|
| Duplicate variant combination     | HTTP 409 with the conflicting key named in the message     |
| Out-of-stock variant selection    | Disabled button + strikethrough style, "Out of Stock" label |
| Invalid form inputs               | Zod (frontend) + class-validator (backend) with field errors |
| Unauthenticated create/delete     | Backend returns 401; frontend redirects to login           |
| Non-existent product/variant      | HTTP 404 with descriptive message                          |

---

## Assumptions

1. Quick Buy is a **simulated** order flow (no payment/order persistence) — the assessment specifies a "flow" demo.
2. Users can self-register; no admin role distinction is required.
3. `synchronize: true` is acceptable for this assessment (would use migrations in production).
4. Images are referenced by URL, not uploaded directly.
