import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "./productSchema";
import { fetchProducts } from "./productsThunks";
import type { AppState } from "../../app/store";

export interface ApiState<T> {
  data: T;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApiState<Product[]> = {
  data: [],
  status: "idle",
  error: null,
};


const slice = createSlice({
    name: "products",
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch products";
            });
    },
})

export const selectProducts = (state: AppState) => state.products;

export const selectProductById = (state: AppState, id: string) =>
  state.products.data.find((product) => product.id === id);
  
export default slice.reducer;