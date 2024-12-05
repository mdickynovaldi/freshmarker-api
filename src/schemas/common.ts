import { z } from "zod";

export const ParamsSlugSchema = z.object({ slug: z.string() });

export const ResponseMessageSchema = z.object({ message: z.string() });

export const ProductInputSchema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  stock: z.number(),
  weight: z.number(),
  images: z.array(z.object({ url: z.string() })),
});
