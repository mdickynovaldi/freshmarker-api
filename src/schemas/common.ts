import { z } from "zod";

export const ParamsSlugSchema = z.object({ slug: z.string() });

export const ResponseMessageSchema = z.object({ message: z.string() });
