import { z } from "zod";
import { ProductCreateInputSchema } from "../../prisma/generated/zod";

export const ProductInputSchema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  stock: z.number(),
  weight: z.number(),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })),
});
