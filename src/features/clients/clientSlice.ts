import { createSlice } from "@reduxjs/toolkit";
import { fetchClients, newClient } from "./clientsThunks";
import type { Client } from "./schemas/clientSchema";
import type { AppState } from "../../app/store";
import { type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export interface ApiState<T> {
  data: T;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApiState<Client[]> = {
  data: [],
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addTempClient: {
      reducer(state, action: PayloadAction<Client>) {
        state.data.push(action.payload);
      },
      prepare(client: Omit<Client, "id" | "isTemp">) {
        return {
          payload: {
            ...client,
            id: nanoid(),
            isTemp: true,
          },
        };
      },
    },
    removeTempClient(state) {
      state.data = state.data.filter((client) => !client.isTemp);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      .addCase(newClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(newClient.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(newClient.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      });
  },
});

export const selectAllClients = (state: AppState) => state.clients;
export const selectClientById = (state: AppState, clientId: string) => {
  state.clients.data.find((client) => client.id === clientId);
};
export const selectTempClient = (state: AppState) => {
  return state.clients.data.find((client) => client.isTemp);
};
export const selectClientByEmail = (state: AppState, clientEmail: string) => {
  state.clients.data.find((client) => client.email === clientEmail);
};

export const { addTempClient, removeTempClient } = slice.actions;
export default slice.reducer;
