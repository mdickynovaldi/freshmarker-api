import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

const tags = ["root"];

export const rootRoute = new OpenAPIHono();

rootRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    responses: { 200: { description: "Root endpoint response" } },
  }),
  (c) => {
    return c.json({
      title: "API",
      description: "FreshMarket products.",
      docs: {
        docs: "/docs",
        swagger: "/swagger",
        openapi: "/openapi.json",
      },
      endpoints: ["/", "/hello", "/products"],
    });
  }
);

rootRoute.openapi(
  createRoute({
    method: "get",
    path: "/hello",
    tags,
    request: {
      query: z.object({ name: z.string().optional() }),
    },
    responses: {
      200: {
        description: "Say hello with the query name",
        content: {
          "application/json": { schema: z.object({ message: z.string() }) },
        },
      },
    },
  }),
  (c) => {
    const { name } = c.req.valid("query");

    if (!name) return c.json({ message: `Hello!` });

    return c.json({ message: `Hello, ${name}!` });
  }
);
