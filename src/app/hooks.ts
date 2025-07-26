import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, AppState, ThunkConfig } from "./store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const createAppSyncThunk = createAsyncThunk.withTypes<ThunkConfig>();
