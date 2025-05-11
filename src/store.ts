import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./slices/authSlice";
import chatReducers from "./slices/chatSlice";
import profileReducers from "./slices/profileSlice";

export default configureStore({
  reducer: {
    authState: authReducers,
    chatState: chatReducers,
    profileState: profileReducers,
  },
});
