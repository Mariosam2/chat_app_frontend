import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./slices/authSlice";
import chatReducers from "./slices/chatSlice";
import profileReducers from "./slices/profileSlice";
import searchReducers from "./slices/searchSlice";
import messageReducers from "./slices/messageSlice";

export default configureStore({
  reducer: {
    authState: authReducers,
    chatState: chatReducers,
    profileState: profileReducers,
    searchState: searchReducers,
    messageState: messageReducers,
  },
});
