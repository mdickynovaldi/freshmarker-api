import * as argon2 from "argon2";
import { z } from "zod";

import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { prisma } from "../libs/db";
import { UserSchema } from "../../prisma/generated/zod";
import { ResponseMessageSchema } from "../schemas/common";
import { sign, verify } from "hono/jwt";
import { EnvSchema } from "../env";
import { authMiddleware, Env } from "../middleware/auth";

const tags = ["auth"];

export const authRoute = new OpenAPIHono<Env>();

const JWT_SECRET = EnvSchema.parse(process.env).JWT_SECRET;

authRoute.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token",
  }
);

// /auth/me
authRoute.openapi(
  createRoute({
    method: "get",
    path: "/me",
    tags,
    security: [{ AuthorizationBearer: [] }],
    middleware: [authMiddleware],
    responses: {
      200: {
        description: "Get user by ID response",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      404: {
        description: "User not found",
        content: {
          "application/json": {
            schema: ResponseMessageSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const user = c.get("user") as { id: string };

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(userData, 200);
  }
);

// /auth/register
authRoute.openapi(
  createRoute({
    method: "post",
    path: "/register",
    tags,
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              email: z.string().email(),
              password: z.string().min(8),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Register user response",
        content: {
          "application/json": {
            schema: z.object({
              user: UserSchema,
              token: z.string(),
            }),
          },
        },
      },
      400: {
        description: "User already exists",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ message: "Email already registered" }, 400);
    }

    const hashedPassword = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: {
          create: { hash: hashedPassword },
        },
      },
    });

    const token = await sign(
      {
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 jam
      },
      JWT_SECRET
    );
    console.log(token);

    return c.json(
      {
        user,
        token,
      },
      200
    );
  }
);

// /auth/login
authRoute.openapi(
  createRoute({
    method: "post",
    path: "/login",
    tags,
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              email: z.string().email(),
              password: z.string().min(8),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login user response",
        content: {
          "application/json": {
            schema: z.object({ token: z.string() }),
          },
        },
      },
      400: {
        description: "Login Failed",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await prisma.user.findUnique({
      where: { email },
      include: { password: true },
    });

    if (!user) {
      return c.json({ message: "User not found" }, 400);
    }
    if (!user.password?.hash) {
      return c.json({ message: "Password not found" }, 400);
    }
    const isPasswordValid = await argon2.verify(user.password.hash, password);

    // console.log({ isPasswordValid });

    if (!isPasswordValid) {
      return c.json({ message: "Invalid password" }, 400);
    }

    const token = await sign(
      {
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 jam
      },
      JWT_SECRET
    );
    console.log({ token });

    return c.json({ token }, 200);
  }
);
