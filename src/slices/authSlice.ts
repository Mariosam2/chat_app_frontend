import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../types";

interface authState {
  authenticated: boolean;
  authUser: User | null;
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
    saveAuthUser: (state: authState, action: PayloadAction<User | null>) => {
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
