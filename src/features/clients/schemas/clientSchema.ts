import * as z from "zod";

export const clientSchema = z.object({
  id: z.string().min(1, "Client Id is required"),
  name: z.string().min(1, "client name must be exsit"),
  email: z.string().email("Invalid Email"),
  phone: z.string().min(6, "must contain at least 10 digits"),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  isTemp: z.boolean().optional().default(false),
});

export type Client = z.infer<typeof clientSchema>;
