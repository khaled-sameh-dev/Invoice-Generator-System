export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "pending"
  | "overdue"
  | "cancelled"
  | "archived";

export interface DateRange {
  start?: string;
  end?: string;
}

export interface AmountRange {
  min?: number;
  max?: number;
  currency?: string;
}

export interface ClientValue {
  id?: string;
  name?: string;
}

export interface BaseFilter<T> {
  id?: string;
  type: FilterType;
  value: T;
  label?: string;
}

export type FilterType =
  | "status"
  | "client"
  | "issueDate"
  | "dueDate"
  | "amount";

export interface StatusFilter extends BaseFilter<InvoiceStatus[]> {
  type: "status";
}

export interface ClientFilter extends BaseFilter<ClientValue> {
  type: "client";
}

export interface IssueDateFilter extends BaseFilter<DateRange> {
  type: "issueDate";
}

export interface DueDateFilter extends BaseFilter<DateRange> {
  type: "dueDate";
}

export interface AmountFilter extends BaseFilter<AmountRange> {
  type: "amount";
}

export type AdvancedFilter =
  | StatusFilter
  | ClientFilter
  | IssueDateFilter
  | DueDateFilter
  | AmountFilter;

export interface AdvancedFilters {
  filters: AdvancedFilter[];
}
