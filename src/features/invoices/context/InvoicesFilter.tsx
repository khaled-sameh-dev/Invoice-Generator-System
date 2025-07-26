import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAdvancedFilters } from "../hooks/useAdvacedFilters";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAllInvoices } from "../invoiesSlice";
import { fetchInvoices } from "../invoicesThunk";
import type { Invoice } from "../schemas/invoice";
import { useStatusFilter, type StatusFilter } from "../hooks/useStatusFilter";

interface FilterContextValue {
  resetFilters: () => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  filteredInvoices: Invoice[];
  advancedFilters: ReturnType<typeof useAdvancedFilters>;
}

const initialState: StatusFilter = {
  type: "all",
  label: "All Invoices",
};

const InvoicesFilterContext = createContext<FilterContextValue | undefined>(
  undefined
);

export default function InvoicesFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialState);
  const advancedFilters = useAdvancedFilters();
  const { data: invoices, status } = useAppSelector(selectAllInvoices);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "idle") dispatch(fetchInvoices());
  }, [dispatch, status]);

  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    let result = useStatusFilter(statusFilter, invoices);

    advancedFilters.filters.forEach((filter) => {
      switch (filter.type) {
        case "issueDate":
        case "dueDate":
          if (filter.value.start) {
            result = result.filter(
              (invoice) =>
                new Date(invoice.date) >= new Date(filter.value.start!)
            );
          }
          if (filter.value.end) {
            result = result.filter(
              (invoice) => new Date(invoice.date) <= new Date(filter.value.end!)
            );
          }
          break;
        case "amount":
          if (filter.value.min) {
            result = result.filter(
              (invoice) => invoice.total >= Number(filter.value.min!)
            );
          }
          if (filter.value.max) {
            result = result.filter(
              (invoice) => invoice.total <= Number(filter.value.max!)
            );
          }
          break;
        case "client":
          if (filter.value.name) {
            result = result.filter((invoice) =>
              invoice.client.name
                .toLowerCase()
                .includes(filter.value.name!.toLowerCase())
            );
          }
          break;
        case "status":
          if (filter.value && filter.value.length > 0) {
            result = result.filter((invoice) =>
              filter.value.includes(invoice.status)
            );
          }
          break;
      }
    });

    return result;
  }, [invoices, statusFilter, advancedFilters.filters]);

  const resetAllFilters = () => {
    setStatusFilter(initialState);
    advancedFilters.resetFilters();
  };

  const value = {
    resetFilters: resetAllFilters,
    statusFilter,
    setStatusFilter,
    filteredInvoices,
    advancedFilters,
  };

  return (
    <InvoicesFilterContext.Provider value={value}>
      {children}
    </InvoicesFilterContext.Provider>
  );
}

export const useInvoicesFilter = () => {
  const context = useContext(InvoicesFilterContext);
  if (!context) {
    throw new Error(
      "useInvoicesFilter must be used within a InvoicesFilterProvider"
    );
  }
  return context;
};
