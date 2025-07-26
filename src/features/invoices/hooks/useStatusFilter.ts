import type { Invoice } from "../schemas/invoice";

export interface StatusFilter {
  type: "all" | "paid" | "unpaid" | "draft";
  label: string;
}

export const useStatusFilter = (filter: StatusFilter, invoices: Invoice[]) => {
  let result = [...invoices];
  if (filter.type !== "all") {
    if (filter.type === "unpaid") {
      result = invoices.filter((invoice) =>
        ["pending", "sent", "overdue"].includes(invoice.status)
      );
    } else {
      result = invoices.filter((invoice) => invoice.status === filter.type);
    }
  }

  return result;
};
