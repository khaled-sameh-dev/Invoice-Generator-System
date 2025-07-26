export const InvoiceStatusValues = [
  "draft",
  "sent",
  "paid",
  "pending",
  "cancelled",
  "overdue",
  "archived",
] as const;

export type InvoiceStatus = (typeof InvoiceStatusValues)[number];

export const invoiceStatus = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  PENDING: "pending",
  CANCELLED: "cancelled",
  OVERDUE: "overdue",
  ARCHIVED: "archived",
} as const;
