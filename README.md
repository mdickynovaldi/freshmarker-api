# FreshMarket API 🛒

[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

A modern REST API for an e-commerce fresh market application, built with Bun and Prisma.

## 📑 Table of Contents

- [Features](#features)
- [API Specification](#api-specification)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)

## Features

- REST API with Express
- PostgreSQL database with Prisma ORM
- Authentication with JWT
- Docker support
- Shopping cart functionality
- Product management

## API Specification

Base URL: `http://localhost:3000`

### Products API

| Endpoint        | HTTP     | Description          |
| --------------- | -------- | -------------------- |
| `/products`     | `GET`    | Get all products     |
| `/products/:id` | `GET`    | Get product by id    |
| `/products`     | `POST`   | Add new product      |
| `/products/:id` | `PUT`    | Update product by id |
| `/products/:id` | `DELETE` | Delete product by id |

### Authentication & User API

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

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Docker](https://docker.com) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Installation

1. Clone the repository
2. Install dependencies:

```sh
bun install
```

### Database Setup

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

## Prisma Setup

You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:

1. Set the `DATABASE_URL` in the `.env` file to point to your existing database. If your database has no tables yet, read <https://pris.ly/d/getting-started>
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
