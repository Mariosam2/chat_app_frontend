import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, MessageSearchResult } from "../types";

interface SearchState {
  query: string;
  clickedResult: MessageSearchResult | User | null;
  searching: boolean;
}

const initialState: SearchState = {
  query: "",
  clickedResult: null,
  searching: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clickResult: (
      state: SearchState,
      action: PayloadAction<MessageSearchResult | User | null>
    ) => {
      state.clickedResult = action.payload;
    },
    setQuery: (state: SearchState, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    isSearching: (state: SearchState, action: PayloadAction<boolean>) => {
      state.searching = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clickResult, setQuery, isSearching } = searchSlice.actions;

export default searchSlice.reducer;
