import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { prisma } from "../libs/db";
import { authMiddleware, Env } from "../middleware/auth";
import { CartSchema } from "../../prisma/generated/zod";

export const cartRoute = new OpenAPIHono<Env>();

// Tags for cart routes
const tags = ["cart"];

// Schema for cart item
const CartItemInputSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

cartRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    security: [{ AuthorizationBearer: [] }],
    middleware: [authMiddleware],
    tags,
    responses: {
      200: {
        description: "Retrieved cart",
        content: { "application/json": { schema: CartSchema } },
      },
    },
  }),
  async (c) => {
    const user = c.get("user") as { id: string };

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { userId: user.id },
        include: { cartItems: { include: { product: true } } },
      });
      return c.json(newCart);
    }

    return c.json(cart);
  }
);

cartRoute.openapi(
  createRoute({
    method: "post",
    path: "/items",
    security: [{ AuthorizationBearer: [] }],
    middleware: [authMiddleware],
    request: {
      body: {
        content: { "application/json": { schema: CartItemInputSchema } },
      },
    },
    tags,
    responses: {
      201: {
        description: "Added cart item",
        content: {
          "application/json": {
            schema: z.object({
              id: z.string(),
              productId: z.string(),
              quantity: z.number(),
            }),
          },
        },
      },
      400: {
        description: "Failed to add cart item",
        content: {
          "application/json": { schema: z.object({ message: z.string() }) },
        },
      },
    },
  }),
  async (c) => {
    const user = c.get("user") as { id: string };
    const body = c.req.valid("json");

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartItems: true },
      // orderBy: { createdAt: "desc" },
    });

    if (!cart) {
      return c.json({ message: "Shopping cart is unavailable" }, 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });

    if (!product) {
      return c.json({ message: "Product not found" }, 400);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: body.productId,
        quantity: body.quantity,
        subTotal: body.quantity * Number(product.price),
      },
      include: { product: true },
    });

    return c.json(cartItem, 201);
  }
);

cartRoute.openapi(
  createRoute({
    method: "delete",
    path: "/items/:id",
    security: [{ AuthorizationBearer: [] }],
    middleware: [authMiddleware],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    tags,
    responses: {
      200: { description: "Cart item deleted successfully" },
      404: { description: "Cart item not found" },
    },
  }),
  async (c) => {
    // const user = c.get("user") as { id: string };
    const { id } = c.req.valid("param");

    const cartItem = await prisma.cartItem.findFirst({
      where: { id },
      include: { product: true },
    });

    if (!cartItem) {
      return c.json({ message: "Cart item not found" }, 404);
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return c.json({ message: "Cart item deleted" }, 200);
  }
);

// PUT /cart/items/:id - Update cart item quantity

cartRoute.openapi(
  createRoute({
    method: "put",
    path: "/items/:id",
    security: [{ AuthorizationBearer: [] }],
    middleware: [authMiddleware],
    request: {
      params: z.object({
        id: z.string(),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              quantity: z.number().min(1),
            }),
          },
        },
      },
    },
    tags,
    responses: {
      200: {
        description: "Cart item updated",
        content: {
          "application/json": {
            schema: z.object({
              id: z.string(),
              productId: z.string(),
              quantity: z.number(),
              userId: z.string(),
            }),
          },
        },
      },
      404: {
        description: "Cart item not found",
      },
    },
  }),
  async (c) => {
    // const user = c.get("user") as { id: string };
    const id = c.req.param("id");
    if (!id) {
      return c.json({ message: "Invalid ID" }, 400);
    }
    const { quantity } = await c.req.json();

    const cartItem = await prisma.cartItem.findFirst({
      where: { id },
      include: { product: true },
    });

    if (!cartItem) {
      return c.json({ message: "Cart item not found" }, 404);
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    return c.json(updatedCartItem);
  }
);
