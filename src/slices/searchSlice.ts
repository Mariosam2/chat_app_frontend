import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, MessageSearchResult } from "../types";

interface SearchState {
  clickedResult: MessageSearchResult | User | null;
}

const initialState: SearchState = {
  clickedResult: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clickResult: (
      state: SearchState,
      action: PayloadAction<MessageSearchResult | User>
    ) => {
      state.clickedResult = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clickResult } = searchSlice.actions;

export default searchSlice.reducer;
