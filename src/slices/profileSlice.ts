import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ProfileState {
  editing: boolean;
  passwordHidden: boolean;
  confirmPasswordHidden: boolean;
  userHasBeenEdited: boolean;
}

const initialState: ProfileState = {
  editing: false,
  passwordHidden: false,
  confirmPasswordHidden: false,
  userHasBeenEdited: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    isEditing: (state: ProfileState, action: PayloadAction<boolean>) => {
      state.editing = action.payload;
    },
    setPasswordHidden: (
      state: ProfileState,
      action: PayloadAction<boolean>
    ) => {
      state.passwordHidden = action.payload;
    },

    setConfirmPasswordHidden: (
      state: ProfileState,
      action: PayloadAction<boolean>
    ) => {
      state.confirmPasswordHidden = action.payload;
    },
    userEdited: (state: ProfileState, action: PayloadAction<boolean>) => {
      state.userHasBeenEdited = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  isEditing,
  setConfirmPasswordHidden,
  setPasswordHidden,
  userEdited,
} = profileSlice.actions;

export default profileSlice.reducer;
