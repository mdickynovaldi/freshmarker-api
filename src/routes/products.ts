import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { prisma } from "../libs/db";
import { ParamsSlugSchema, ResponseMessageSchema } from "../schemas/common";
import {
  ProductSchema,
  ImageSchema,
  ProductCreateInputSchema,
} from "../../prisma/generated/zod";
import { ProductInputSchema } from "../schemas/product";

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
        content: {
          "application/json": {
            schema: z.array(
              ProductSchema.extend({ images: z.array(ImageSchema) })
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });

    return c.json(products, 200);
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
        content: {
          "application/json": {
            schema: ProductSchema.extend({
              images: z.array(ImageSchema),
            }),
          },
        },
      },
      404: {
        description: "Get product by slug not found response",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const { slug } = c.req.valid("param");

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!product) return c.json({ message: "Product not found" }, 404);

    return c.json(product, 200);
  }
);

productsRoute.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags,
    description: "Add new product",
    request: {
      body: {
        content: {
          "application/json": {
            schema: ProductInputSchema,
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
    const body = c.req.valid("json");

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
            create: body.images.map((image) => ({
              url: image.url,
              alt: image.alt || "",
            })),
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

productsRoute.openapi(
  createRoute({
    method: "put",
    path: "/:id",
    tags,
    description: "Edit existing product",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: ProductInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Product updated successfully",
        content: { "application/json": { schema: ProductSchema } },
      },
      400: {
        description: "Failed to update product",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
      404: {
        description: "Product not found",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.valid("json");

    try {
      const product = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          slug: body.slug,
          name: body.name,
          price: body.price,
          description: body.description,
          stock: body.stock,
          weight: body.weight,
        },
        include: {
          images: true,
        },
      });

      return c.json(product, 200);
    } catch (error) {
      return c.json({ message: "Failed to add product" }, 400);
    }
  }
);

productsRoute.openapi(
  createRoute({
    method: "delete",
    path: "/:slug",
    tags,
    description: "Delete product by slug",
    request: {
      params: ParamsSlugSchema,
    },
    responses: {
      200: {
        description: "Product deleted successfully",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
      404: {
        description: "Product not found",
        content: { "application/json": { schema: ResponseMessageSchema } },
      },
    },
  }),
  async (c) => {
    const slug = c.req.valid("param");

    try {
      const product = await prisma.product.delete({
        where: slug,
      });

      if (!product) {
        return c.json({ message: "Product not found" }, 404);
      }

      return c.json({ message: "Product deleted successfully" }, 200);
    } catch (error) {
      return c.json({ message: "Failed to delete product" }, 404);
    }
  }
);
