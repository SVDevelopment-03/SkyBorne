import { storage } from "@/lib/storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/types/auth";
const isBrowser = typeof window !== "undefined";

const initialState: AuthState = {
  user: isBrowser ? storage.get<User>(process.env.NEXT_PUBLIC_USER as string) : null,

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
        user: User;
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
      localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN as string);
      localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN as string);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
