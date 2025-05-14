import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatType, Message } from "../types";

export interface ChatState {
  chats: ChatType[];
  activeChat: string;
  loading: boolean;
  messages: Message[];
}

const initialState: ChatState = {
  chats: [],
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
    removeMessage: (state: ChatState, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (message) => message.uuid !== action.payload
      );
    },
    setActiveChat: (state: ChatState, action: PayloadAction<string>) => {
      state.activeChat = action.payload;
    },
    setChats: (state: ChatState, action: PayloadAction<ChatType[]>) => {
      state.chats = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setMessages,
  finishedChatLoading,
  chatLoading,
  setActiveChat,
  removeMessage,
  setChats,
} = chatSlice.actions;

export default chatSlice.reducer;
