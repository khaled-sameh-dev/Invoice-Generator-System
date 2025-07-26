import { format, addDays } from "date-fns";

export function getTodayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getDueDateISO(days = 3) {
  return format(addDays(new Date(), days), "yyyy-MM-dd");
}

export function formatDisplayDate(date: string | Date) {
  return format(new Date(date), "yyyy/MM/dd");
}
