import axios from "axios";
import { createAppSyncThunk } from "../../app/hooks";

const API_URL = "http://localhost:3001/products";

export const fetchProducts = createAppSyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
