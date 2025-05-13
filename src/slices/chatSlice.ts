import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../types";

export interface ChatState {
  activeChat: string;
  loading: boolean;
  messages: Message[];
}

const initialState: ChatState = {
  activeChat: "",
  loading: false,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chatLoading: (state: ChatState) => {
      state.loading = true;
    },
    finishedChatLoading: (state: ChatState) => {
      state.loading = false;
    },
    setMessages: (state: ChatState, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setActiveChat: (state: ChatState, action: PayloadAction<string>) => {
      state.activeChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMessages, finishedChatLoading, chatLoading, setActiveChat } =
  chatSlice.actions;

export default chatSlice.reducer;
