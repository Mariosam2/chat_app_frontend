import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser } from "../helpers/axiosInterceptor";

interface authState {
  authenticated: boolean;
  authUser: AuthUser | null;
  loading: boolean;
}

const initialState: authState = {
  authenticated: false,
  authUser: null,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLoading: (state: authState) => {
      state.loading = true;
    },
    finishedAuthLoading: (state: authState) => {
      state.loading = false;
    },
    saveAuthUser: (
      state: authState,
      action: PayloadAction<AuthUser | null>
    ) => {
      state.authUser = action.payload !== null ? { ...action.payload } : null;
    },
    authenticate: (state: authState, action: PayloadAction<boolean>) => {
      //console.log("authenticate");
      state.authenticated = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveAuthUser, authenticate, authLoading, finishedAuthLoading } =
  authSlice.actions;

export default authSlice.reducer;
