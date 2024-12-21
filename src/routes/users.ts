import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { prisma } from "../libs/db";
import { z } from "zod";
import { UserSchema } from "../../prisma/generated/zod";
import { ResponseMessageSchema } from "../schemas/common";

const tags = ["users"];

export const usersRoute = new OpenAPIHono();

usersRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    responses: {
      200: {
        description: "Get all users response",
        content: {
          "application/json": {
            schema: z.array(UserSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const users = await prisma.user.findMany();
    return c.json(users);
  }
);

usersRoute.openapi(
  createRoute({
    method: "get",
    path: "/{username}",
    tags,
    request: { params: z.object({ username: z.string() }) },
    responses: {
      200: {
        description: "Get one user",
        content: {
          "application/json": { schema: UserSchema },
        },
      },
      404: {
        description: "User not found",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const { username } = c.req.valid("param");

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(user, 200);
  }
);
