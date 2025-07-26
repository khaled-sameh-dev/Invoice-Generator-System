import { createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "react-router-dom";
import type Client from "./types/Client";

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:3001/clients");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const newClient = createAsyncThunk(
  "clients/newClient",
  async (client: Client, { rejectWithValue }) => {
    try {
      const data = { ...client, id: nanoid() };
      const res = await axios.post("http://localhost:3001/clients", data);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(
        error.response?.data?.statusText ||
          error.message ||
          "Something went wrong"
      );
    }
  }
);
