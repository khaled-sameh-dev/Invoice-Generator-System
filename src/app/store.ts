import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "../features/clients/clientSlice";
import productsReducer from "../features/products/productsSlice";
import invoicesReducer from "../features/invoices/invoiesSlice";
const store = configureStore({
  reducer: {
    clients: clientsReducer,
    products: productsReducer,
    invoices: invoicesReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ThunkConfig = {
  state: AppState;
  dispatch: AppDispatch;
};

export default store;
