import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { publicApi } from "./api/publicApi";
import { meetingApi } from "./api/meetingApi";

import authReducer from "./slices/authSlice";
import { paymentApi } from "./api/paymentApi";
import { trainerApi } from "./api/trainerApi";
import { countryApi } from "./api/countryApi";
import { serviceApi } from "./api/serviceApi";
import { adminApi } from "./api/adminApi";
import { regionApi } from "./api/regionApi";
import { userApi } from "./api/userApi";
import { feedbackApi } from "./api/feedbackApi";
import { invoiceApi } from "./api/InvoiceApi";
import { productApi } from "./api/productApi";
import { customerApi } from "./api/customerApi";
import { orderApi } from "./api/orderApi";

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
    [adminApi.reducerPath]: adminApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(publicApi.middleware)
      .concat(meetingApi.middleware)
      .concat(paymentApi.middleware)
      .concat(trainerApi.middleware)
      .concat(countryApi.middleware)
      .concat(serviceApi.middleware)
      .concat(adminApi.middleware)
      .concat(regionApi.middleware)
      .concat(userApi.middleware)
      .concat(feedbackApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(productApi.middleware)
      .concat(customerApi.middleware)
      .concat(orderApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
