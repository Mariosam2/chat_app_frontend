import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../types";

interface ChatState {
  messages: Message[] | null;
}

const initialState: ChatState = {
  messages: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state: ChatState, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMessages } = chatSlice.actions;

export default chatSlice.reducer;
