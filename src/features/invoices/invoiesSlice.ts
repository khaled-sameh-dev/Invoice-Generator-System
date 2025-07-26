import { createSlice } from "@reduxjs/toolkit";
import type { Invoice } from "./schemas/invoice";
import {
  createNewInvoice,
  fetchInvoices,
  updateInvoice,
} from "./invoicesThunk";
import type { AppState } from "../../app/store";

interface InitialState {
  data: Invoice[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InitialState = {
  data: [],
  status: "idle",
  error: null,
};
const slice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createNewInvoice.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createNewInvoice.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(updateInvoice.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (invoice) => invoice.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectAllInvoices = (state: AppState) => state.invoices;

export const selectInvoicesCounts = (state: AppState) => {
  const invoices = state.invoices.data;

  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
  const unpaidInvoices = invoices.filter((inv) =>
    ["pending", "sent", "overdue"].includes(inv.status)
  );
  const draftInvoices = invoices.filter((inv) => inv.status === "draft");
  const cancelledInvoices = invoices.filter(
    (inv) => inv.status === "cancelled"
  );

  const calculateTotal = (invs: Invoice[]) =>
    invs.reduce((sum, inv) => sum + inv.total, 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const filterByMonth = (invs: Invoice[], month: number, year: number) => {
    return invs.filter((inv) => {
      const invDate = new Date(inv.date);
      return invDate.getMonth() === month && invDate.getFullYear() === year;
    });
  };

  const calculatePercentageChange = (
    currentCount: number,
    previousCount: number
  ) => {
    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    return ((currentCount - previousCount) / previousCount) * 100;
  };

  const currentMonthPaid = filterByMonth(
    paidInvoices,
    currentMonth,
    currentYear
  );
  const previousMonthPaid = filterByMonth(
    paidInvoices,
    previousMonth,
    previousYear
  );
  const paidPercentageChange = calculatePercentageChange(
    currentMonthPaid.length,
    previousMonthPaid.length
  );

  const currentMonthUnpaid = filterByMonth(
    unpaidInvoices,
    currentMonth,
    currentYear
  );
  const previousMonthUnpaid = filterByMonth(
    unpaidInvoices,
    previousMonth,
    previousYear
  );
  const unpaidPercentageChange = calculatePercentageChange(
    currentMonthUnpaid.length,
    previousMonthUnpaid.length
  );

  const currentMonthDraft = filterByMonth(
    draftInvoices,
    currentMonth,
    currentYear
  );
  const previousMonthDraft = filterByMonth(
    draftInvoices,
    previousMonth,
    previousYear
  );
  const draftPercentageChange = calculatePercentageChange(
    currentMonthDraft.length,
    previousMonthDraft.length
  );

  const currentMonthCancelled = filterByMonth(
    cancelledInvoices,
    currentMonth,
    currentYear
  );
  const previousMonthCancelled = filterByMonth(
    cancelledInvoices,
    previousMonth,
    previousYear
  );
  const cancelledPercentageChange = calculatePercentageChange(
    currentMonthCancelled.length,
    previousMonthCancelled.length
  );

  const currentMonthAll = filterByMonth(invoices, currentMonth, currentYear);
  const previousMonthAll = filterByMonth(invoices, previousMonth, previousYear);
  const allPercentageChange = calculatePercentageChange(
    currentMonthAll.length,
    previousMonthAll.length
  );

  return {
    all: {
      count: invoices.length,
      total: calculateTotal(invoices),
      percentageChange: allPercentageChange,
      trend: allPercentageChange >= 0 ? "up" : "down",
    },
    paid: {
      count: paidInvoices.length,
      total: calculateTotal(paidInvoices),
      percentageChange: paidPercentageChange,
      trend: paidPercentageChange >= 0 ? "up" : "down",
    },
    unpaid: {
      count: unpaidInvoices.length,
      total: calculateTotal(unpaidInvoices),
      percentageChange: unpaidPercentageChange,
      trend: unpaidPercentageChange >= 0 ? "up" : "down",
    },
    draft: {
      count: draftInvoices.length,
      total: calculateTotal(draftInvoices),
      percentageChange: draftPercentageChange,
      trend: draftPercentageChange >= 0 ? "up" : "down",
    },
    cancelled: {
      count: cancelledInvoices.length,
      total: calculateTotal(cancelledInvoices),
      percentageChange: cancelledPercentageChange,
      trend: cancelledPercentageChange >= 0 ? "up" : "down",
    },
  };
};

export const selectInvoiceById = (state: AppState, invoiceId: string) =>
  state.invoices.data.find((invoice) => invoice.id === invoiceId);
export const selectInvoiceStatus = (state: AppState, invoiceId: string) =>
  state.invoices.data.find((invoice) => invoice.id === invoiceId)?.status ||
  "draft";

export default slice.reducer;
