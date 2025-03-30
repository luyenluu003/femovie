import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Kiểm tra lại đường dẫn!

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tuần tự hóa nếu cần
    }),
});

export default store;
