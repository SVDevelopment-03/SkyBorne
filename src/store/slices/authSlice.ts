/* eslint-disable @typescript-eslint/no-explicit-any */

import { storage } from "@/lib/storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const isBrowser = typeof window !== "undefined";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: isBrowser ? storage.get(process.env.NEXT_PUBLIC_USER as string) : null,

  accessToken: isBrowser
    ? localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string)
    : null,
  refreshToken: isBrowser
    ? localStorage.getItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: any;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem(process.env.NEXT_PUBLIC_USER as string);
      localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_Token as string);
      localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_Token as string);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
