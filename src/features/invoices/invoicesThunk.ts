import axios from "axios";
import { createAppSyncThunk } from "../../app/hooks";
import type { Invoice } from "./schemas/invoice";
import { nanoid } from "@reduxjs/toolkit";

type UpdateInvoicePayload = Invoice & { id: string };

const API_URL = "http://localhost:3001/invoices";

export const fetchInvoices = createAppSyncThunk(
  "invoices/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const resounse = await axios.get(API_URL);
      return resounse.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch invoices");
    }
  }
);

export const updateInvoice = createAppSyncThunk(
  "invoices/updateInvoice",
  async (invoice: UpdateInvoicePayload, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${invoice.id}`, invoice);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update invoice");
    }
  }
);

export const createNewInvoice = createAppSyncThunk(
  "invoices/createNewInvoice",
  async (invoice: Omit<Invoice, "id">, { rejectWithValue }) => {
    try {
      const newInvoice = {
        ...invoice,
        id: nanoid(),
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      const response = await axios.post(API_URL, newInvoice);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create invoice");
    }
  }
);
