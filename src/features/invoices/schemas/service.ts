import { z } from "zod";

export const currencySchema = z.enum(["EGP", "USD"]);
export type Currency = z.infer<typeof currencySchema>;

export const serviceTypeSchema = z.enum(["service", "item"]);
export type ServiceType = z.infer<typeof serviceTypeSchema>;

export const invoiceItemSchema = z
  .object({
    type: serviceTypeSchema,
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0.1, "Price must be at least 0.1").positive(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    currency: currencySchema,
    productId: z.string().optional(),
    amount: z.number().min(0, "Amount must be at least 0.1"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "item" && !data.productId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product must be selected for items",
        path: ["productId"],
      });
    }

    if (data.currency === "USD" && data.price < 0.1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price must be at least $0.1 for USD",
        path: ["price"],
      });
    }

    if (data.currency === "EGP" && data.price < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price must be at least EGP 5",
        path: ["price"],
      });
    }
     if (data.amount !== data.price * data.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Amount must equal price × quantity",
        path: ["amount"],
      });
    }
  });

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
