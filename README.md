# FreshMarket API 🛒

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

<div id="description">
Modern REST API application for fresh market e-commerce, built using Bun and Prisma.
</div>

<div id="table-of-contents">
 <h2>📑 Table of Contents</h2>

- [Features](#features)
- [API Specification](#api-specification)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
</div>

<div id="features">
 <h2>✨ Main Features</h2>

- 🚀 REST API with Express - Fast and efficient API
- 📊 PostgreSQL Database with Prisma ORM - Reliable data management
- 🔐 Authentication with JWT - Guaranteed security
- 🐳 Docker Support - Easy deployment
- 🛒 Shopping cart functionality - Seamless shopping experience
- 📦 Product management - Full inventory control
</div>

<div id="api-specification">
 <h2>🔌 API Specification</h2>

Base URL: `http://localhost:3000`

## Products API

| Endpoint        | HTTP     | Description          |
| --------------- | -------- | -------------------- |
| `/products`     | `GET`    | Get all products     |
| `/products/:id` | `GET`    | Get product by id    |
| `/products`     | `POST`   | Add new product      |
| `/products/:id` | `PUT`    | Update product by id |
| `/products/:id` | `DELETE` | Delete product by id |

## Authentication & User API

| Endpoint           | HTTP     | Permission    | Description           |
| ------------------ | -------- | ------------- | --------------------- |
| `/users`           | `GET`    | Public        | Get all users         |
| `/users/:username` | `GET`    | Public        | Get user by username  |
| `/auth/register`   | `POST`   | Public        | Register new user     |
| `/auth/login`      | `POST`   | Public        | Login user            |
| `/auth/me`         | `GET`    | Authenticated | Get current user      |
| `/auth/logout`     | `POST`   | Authenticated | Logout user           |
| `/cart`            | `GET`    | Authenticated | Get cart items        |
| `/cart/items`      | `POST`   | Authenticated | Add item to cart      |
| `/cart/items/:id`  | `DELETE` | Authenticated | Remove item from cart |
| `/cart/items/:id`  | `PUT`    | Authenticated | Update item in cart   |

</div>

<div id="getting-started">
 <h2>🚀 Getting Started</h2>

### Initial Setup

Make sure the following tools are installed on your system:

- [Bun](https://bun.sh) - Modern JavaScript runtime & package manager
- [Docker](https://docker.com) - Containerization platform
- [Docker Compose](https://docs.docker.com/compose/) - Tool for running multi-container

### Detailed Installation Steps

1. **Clone Repository**

```bash
git clone https://github.com/username/freshmarket-api
cd freshmarket-api
```

2. **Install Dependencies**

```bash
bun install
```

### Database Configuration

1. **Setup Environment File**

```bash
# Copy environment example file
cp .env.example .env
```

2. **Configure Environment Variables**
   Open the `.env` file and adjust according to your database configuration:

```env
# Database connection configuration
DATABASE_URL=postgresql://user:password@localhost:5432/freshmarket

# PostgreSQL Credentials
POSTGRES_USER=user          # Replace with your chosen username
POSTGRES_PASSWORD=password  # Replace with a secure password
POSTGRES_DB=freshmarket    # Database name
```

3. **Run Database**

```bash
# Using docker compose
docker compose up -d

# OR using available script
bun docker:up
```

4. **Database Setup**

```bash
# Run database migrations
bun migrate

# Fill initial data (seed)
bun db:seed
```

### Running the Application

```bash
# Development mode with hot reload
bun dev

# OR production mode
bun start
```

🌐 Access API at: http://localhost:3000

### Development Tips

- Use Postman or Thunder Client for API testing
- Monitor Docker logs for debugging
- Use Prisma Studio for visual database management:
  ```bash
  bun prisma studio
  ```
  </div>

<div id="database-setup">
 <h2>🗄️ Database Setup</h2>

Setup the `.env` file:

```sh
cp .env.example .env
```

Edit `.env`:

```sh
DATABASE_URL=postgresql://user:password@localhost:5432/freshmarket

POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=freshmarket
```

Setup database:

```sh
# Run database only
docker compose up -d

# Or
bun docker:up
```

Migrate database:

```sh
bun migrate
```

Seed initial products:

```sh
bun db:seed
```

To run:

```sh
# Development with hot reload
bun dev

# Or production
bun start
```

Open <http://localhost:3000>

### Development Tips

- Use Postman or Thunder Client for API testing
- Monitor Docker logs for debugging
- Use Prisma Studio for visual database management:
  ```bash
  bun prisma studio
  ```
  </div>

## Prisma Setup

You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:

1. Set the `DATABASE_URL` in the `.env` file to point to your existing database. If your database has no tables yet, read <https://pris.ly/d/getting-started>
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

</div>
```
