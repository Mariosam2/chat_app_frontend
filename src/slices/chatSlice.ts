import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatType, User } from "../types";

export interface ChatState {
  chats: ChatType[];
  activeChat: { uuid: string; receiver: User } | null;
  loading: boolean;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
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

    setActiveChat: (
      state: ChatState,
      action: PayloadAction<{ uuid: string; receiver: User } | null>
    ) => {
      state.activeChat = action.payload;
    },
    removeChat: (state: ChatState, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.uuid !== action.payload);
    },
    setChats: (state: ChatState, action: PayloadAction<ChatType[]>) => {
      state.chats = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  finishedChatLoading,
  chatLoading,
  setActiveChat,
  setChats,
  removeChat,
} = chatSlice.actions;

export default chatSlice.reducer;
