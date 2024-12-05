import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { prisma } from "../libs/db";
import { ProductSchema } from "../../prisma/generated/zod";
import {
  ParamsSlugSchema,
  ProductInputSchema as ProductAddSchema,
  ResponseMessageSchema,
} from "../schemas/common";

const tags = ["products"];

export const productsRoute = new OpenAPIHono();

productsRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags,
    description: "Get all products",
    responses: {
      200: {
        description: "Get all products response",
        content: { "application/json": { schema: z.array(ProductSchema) } },
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });

    return c.json(products);
  }
);

productsRoute.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
    tags,
    description: "Get product by slug",
    request: {
      params: ParamsSlugSchema,
    },
    responses: {
      200: {
        description: "Get product by slug response",
        content: { "application/json": { schema: ProductSchema } },
      },
      404: {
        description: "Get product by slug not found response",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    const product = await prisma.product.findUnique({ where: { slug } });

    if (!product) return c.json({ message: "Product not found" }, 404);

    return c.json(product, 200);
  }
);

productsRoute.openapi(
  createRoute({
    method: "post",
    path: "/add",
    tags,
    description: "Add new product",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ProductAddSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Product added successfully",
        content: { "application/json": { schema: ProductSchema } },
      },
      400: {
        description: "Failed to add product",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const body = await c.req.valid("json");

    try {
      const product = await prisma.product.create({
        data: {
          slug: body.slug,
          name: body.name,
          price: body.price,
          description: body.description,
          stock: body.stock,
          weight: body.weight,
          images: {
            create: body.images,
          },
        },
        include: {
          images: true,
        },
      });

      return c.json(product, 201);
    } catch (error) {
      return c.json({ message: "Failed to add product" }, 400);
    }
  }
);
