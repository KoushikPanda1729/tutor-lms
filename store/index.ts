import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
