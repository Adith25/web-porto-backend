# 🚀 Backend Services - Web Portfolio

This is the backend API repository supporting the **Web Portfolio** application. It provides secure Data Management, API Endpoints, and Authentication handled by modern Node.js and TypeScript technologies.

---

## 1. Technologies Used

The backend is built using a highly scalable and robust architecture:

- **Framework:** [NestJS](https://nestjs.com/) (v11) - A progressive Node.js framework for building efficient and scalable server-side applications.
- **Database ORM:** [Prisma](https://www.prisma.io/) (v7.4) - Next-generation Node.js and TypeScript ORM.
- **Database System:** PostgreSQL (via `pg` and Prisma's PostgreSQL adapter).
- **Authentication & Security:** 
  - JWT (JSON Web Tokens) for stateless authentication (`@nestjs/jwt`).
  - Passport.js for auth strategies (`@nestjs/passport`).
  - Password Hashing using `bcrypt`.
- **Validation & Serialization:** `class-validator` and `class-transformer` for robust API payload validation.
- **File Handling:** `multer` and `@nestjs/platform-express` for file uploads.
- **Language:** TypeScript.

---

## 2. Project Folder Structure

The application follows the modular architecture recommended by NestJS:

```text
📦 backend
 ┣ 📂 dist/            # Compiled output files (JavaScript)
 ┣ 📂 node_modules/    # Dependency packages
 ┣ 📂 prisma/          # Prisma database schema and migrations
 ┣ 📂 src/             # Application source code
 ┃ ┣ 📂 ... (Modules, Controllers, Services, DTOs, Entities)
 ┃ ┗ 📜 main.ts        # The entry file of the application
 ┣ 📂 test/            # End-to-end (e2e) tests
 ┣ 📂 uploads/         # Storage for locally uploaded files
 ┣ 📜 .env             # Environment variables mapping
 ┣ 📜 db_dump.bak      # Database backup file
 ┣ 📜 nest-cli.json    # NestJS CLI configuration
 ┣ 📜 prisma.config.ts # Configuration file for Prisma ORM
 ┣ 📜 seed.ts          # Script to populate initial database data (Seeding)
 ┣ 📜 package.json     # Project dependencies and npm scripts
 ┗ 📜 tsconfig.json    # TypeScript compiler options
```

---

## 3. Key Features

- **Robust REST API:** A fully typed, module-based architecture handling various endpoints for Portfolio content (Projects, Experiences, Certificates).
- **Secure Authentication:** JWT-based login mechanisms for protecting Admin dashboard routes.
- **Database Management:** Strongly-typed database schema operations integrated with Prisma ORM and PostgreSQL.
- **Content Validation:** Utilizing decorators (`class-validator`) to ensure incoming request data integrity.
- **File Upload Capability:** Handles static file and media uploads directly to the server.

---

## 4. Usage & Setup Guide

Ensure your development environment meets the following requirements:
- **Node.js** (v18.x or newer)
- **PostgreSQL** Database running locally or remotely.

### 1. Installation

Install all the required dependencies using npm:

```bash
npm install
```

### 2. Environment Configuration

Create or update the `.env` file in the root directory and ensure the database connection string and JWT Secrets are properly configured:

```env
# Example .env properties
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db?schema=public"
JWT_SECRET="your_super_secret_key"
```

### 3. Database Setup (Prisma)

Before starting the server, apply database migrations and generate the Prisma Client:

```bash
# Apply database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

*(Optional)* If you need to populate the initial data, you can run the seed script:
```bash
npx ts-node seed.ts
```

### 4. Running the Application

You can start the backend server in several modes:

```bash
# Development mode
npm run start

# Watch mode (Hot-reload during development)
npm run start:dev

# Production mode
npm run start:prod
```
> The server typically runs on `http://localhost:3001` (or whatever port is defined in the `main.ts` / `.env` config).

### 5. Testing

The application includes unit and end-to-end testing setups via Jest:

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov
```
