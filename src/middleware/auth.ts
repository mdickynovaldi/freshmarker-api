import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

import { prisma } from "../libs/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export type Env = {
  Variables: {
    user: {
      id: string;
    };
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        { message: "Not allowed. Authorization header is required" },
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json({ message: "Not allowed. Token is required" }, 401);
    }

    const jwtPayload = await verify(token, JWT_SECRET);

    const userId = jwtPayload.sub as string;

    if (!userId) {
      return c.json({ message: "User ID doesn't exist" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    c.set("user", user);

    await next();
  } catch (error) {
    console.error(error);
    return c.json("Failed to check auth token", 401);
  }
});
