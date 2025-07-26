import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0.1, "Price must be at least 0.1"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  isAvailable: z.boolean().default(true),
});

export type Product = z.infer<typeof productSchema>;
