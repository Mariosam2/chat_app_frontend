import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser } from "../helpers/axiosInterceptor";

interface authState {
  authenticated: boolean;
  authUser: AuthUser | null;
}

const initialState: authState = {
  authenticated: false,
  authUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveAuthUser: (state: authState, action: PayloadAction<AuthUser>) => {
      state.authUser = { ...action.payload };
    },
    authenticate: (state: authState) => {
      console.log("authenticate");
      state.authenticated = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveAuthUser, authenticate } = authSlice.actions;

export default authSlice.reducer;
