import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { publicApi } from "./api/publicApi";
import { meetingApi } from "./api/meetingApi";

import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(publicApi.middleware)
      .concat(meetingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
