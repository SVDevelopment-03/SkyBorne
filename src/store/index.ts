import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { publicApi } from "./api/publicApi";
import { meetingApi } from "./api/meetingApi";

import authReducer from "./slices/authSlice";
import { paymentApi } from "./api/paymentApi";
import { trainerApi } from "./api/trainerApi";
import { countryApi } from "./api/countryApi";
import { serviceApi } from "./api/serviceApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [trainerApi.reducerPath]: trainerApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
     [serviceApi.reducerPath]: serviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(publicApi.middleware)
      .concat(meetingApi.middleware)
      .concat(paymentApi.middleware)
      .concat(trainerApi.middleware)
      .concat(countryApi.middleware)
      .concat(serviceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
