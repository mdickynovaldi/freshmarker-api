import { Context, Next } from "hono";
import { verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, JWT_SECRET);
    c.set("jwtPayload", payload);
    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized - Invalid token" }, 401);
  }
}
