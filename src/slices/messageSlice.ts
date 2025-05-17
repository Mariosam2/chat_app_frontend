import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Message } from "../types";
import { chatApi } from "../helpers/axiosInterceptor";

interface MessagesResponse {
  success: boolean;
  messages: Message[];
}

export interface AxiosError extends Error {
  response: {
    statusText: string;
    status: number;
  };
}

export const isAxiosError = (obj: unknown): obj is AxiosError => {
  if (obj && (obj as AxiosError).response) {
    return (
      typeof (obj as AxiosError).response.statusText === "string" &&
      typeof (obj as AxiosError).response.status === "number"
    );
  }
  return false;
};

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (
    { userUUID, chatUUID }: { userUUID: string; chatUUID: string },
    thunkAPI
  ) => {
    try {
      const messages = await chatApi.get<MessagesResponse>(
        `/api/messages/${userUUID}/${chatUUID}`
      );
      return messages.data;
    } catch (err: unknown) {
      if (err && isAxiosError(err)) {
        return thunkAPI.rejectWithValue({
          response: {
            status: err.response.status,
            statusText: err.response.statusText,
          },
        });
      }
      return thunkAPI.rejectWithValue("error while fetching messages");
    }
  }
);

export interface MessageState {
  loading: boolean;
  messages: Message[];
  error: unknown;
  isEditing: boolean;
  messageToEdit: Message | null;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
  isEditing: false,
  messageToEdit: null,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    cleanError: (state: MessageState) => {
      state.error = null;
    },

    editingMessage: (
      state: MessageState,
      action: PayloadAction<{
        isEditing: boolean;
        messageToEdit: Message | null;
      }>
    ) => {
      const { isEditing, messageToEdit } = action.payload;
      state.isEditing = isEditing;
      state.messageToEdit = messageToEdit;
    },
    setMessages: (state: MessageState, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state: MessageState, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    removeMessage: (state: MessageState, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (message) => message.uuid !== action.payload
      );
    },
    editMessage: (
      state: MessageState,
      action: PayloadAction<{ messageUUID: string; newMessage: Message }>
    ) => {
      const temp = state.messages.map((message) => {
        const { uuid } = message;
        return uuid;
      });

      const messageToEdit = temp.find(
        (uuid) => uuid === action.payload.messageUUID
      );

      if (messageToEdit) {
        const messageToEditIdx = temp.indexOf(messageToEdit);
        //console.log(messageToEditIdx);

        state.messages[messageToEditIdx] = action.payload.newMessage;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state: MessageState) => {
        state.loading = true;
      })
      .addCase(
        getMessages.fulfilled,
        (state: MessageState, action: PayloadAction<MessagesResponse>) => {
          state.loading = false;
          const { messages } = action.payload;
          state.messages = messages;
        }
      )
      .addCase(
        getMessages.rejected,
        (state: MessageState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

// Action creators are generated for each case reducer function
export const {
  cleanError,
  addMessage,
  editingMessage,
  removeMessage,
  editMessage,
  setMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
