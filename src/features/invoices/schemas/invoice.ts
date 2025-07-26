import { z } from "zod";
import { clientSchema } from "../../clients/schemas/clientSchema";
import { invoiceItemSchema } from "./service";
import convertCurrency from "../../../utils/convertCurrencies";
import { InvoiceStatusValues } from "../types/InvoiceStatus";

export const invoiceSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    number: z.string().min(1, "Invoice number is required"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    status: z.enum(InvoiceStatusValues).default("draft"),
    client: clientSchema.refine((client) => client.id !== "", {
      message: "Please select a client",
    }),
    services: z
      .array(invoiceItemSchema)
      .min(1, "At least one service or item is required"),
    notes: z.string().optional(),
    subtotal: z.number().min(0),
    taxTotal: z.number().min(0),
    total: z.number().min(0),
    taxRate: z.number().min(0).max(100).default(0),
    currency: z.enum(["USD", "EGP"]).default("USD"),
    discount: z.number().min(0).default(0),
    discountType: z.enum(["fixed", "percentage"]).default("fixed"),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.client.id || data.client.id === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a client",
        path: ["client"],
      });
    }

    const calculatedSubtotal = data.services.reduce((sum, item) => {
      let amount = item.amount || 0;

      if (item.currency !== data.currency) {
        amount = convertCurrency(amount, item.currency, data.currency);
      }

      return sum + amount;
    }, 0);

    if (Math.abs(data.subtotal - calculatedSubtotal) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Subtotal (${data.subtotal}) doesn't match sum of services (${calculatedSubtotal})`,
        path: ["subtotal"],
      });
    }

    // 3. Tax validation
    const expectedTax = (data.subtotal * (data.taxRate || 0)) / 100;
    if (Math.abs(data.taxTotal - expectedTax) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Tax total (${data.taxTotal}) doesn't match calculated tax (${expectedTax})`,
        path: ["taxTotal"],
      });
    }

    // 4. Total validation (before discount)
    const expectedTotalBeforeDiscount = data.subtotal + data.taxTotal;

    // 5. Apply discount
    let discountAmount = 0;
    if (data.discountType === "percentage") {
      discountAmount = (data.subtotal * data.discount) / 100;
    } else {
      discountAmount = data.discount;
    }

    const expectedTotal = expectedTotalBeforeDiscount - discountAmount;

    if (Math.abs(data.total - expectedTotal) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total (${data.total}) doesn't match calculated total (${expectedTotal})`,
        path: ["total"],
      });
    }
  });

export type Invoice = z.infer<typeof invoiceSchema>;
