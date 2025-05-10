import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./slices/authSlice";
import chatReducers from "./slices/chatSlice";

export default configureStore({
  reducer: { authState: authReducers, chatState: chatReducers },
});
