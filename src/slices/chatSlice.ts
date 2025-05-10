import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { Message } from "../types";
import { chatApi } from "../helpers/axiosInterceptor";
import { type ChatType } from "../types";

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

/* export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.get<{
        success: boolean;
        chats: ChatType[];
      }>("/api/chats"); // Endpoint fittizio
      if (response.data.success) {
        return response.data.chats;
      }
      return rejectWithValue("Failed to fetch chats");
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Could not fetch chats"
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await chatApi.get<{
        success: boolean;
        messages: Message[];
      }>(`/api/chats/${chatId}/messages`); // Endpoint fittizio
      if (response.data.success) {
        return { chatId, messages: response.data.messages };
      }
      return rejectWithValue("Failed to fetch messages");
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Could not fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chatId, content }: { chatId: string; content: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await chatApi.post<{
        success: boolean;
        message: Message;
      }>(`/api/chats/${chatId}/messages`, { content });
      if (response.data.success) {
        // Potresti voler aggiornare la lista chat se questo messaggio diventa l'ultimo
        dispatch(fetchChats()); // Semplice re-fetch, o aggiornamento più mirato
        return response.data.message;
      }
      return rejectWithValue("Failed to send message");
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Could not send message"
      );
    }
  }
); */

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
