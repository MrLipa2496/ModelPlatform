import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  sendMessageRequest,
  getConversationsRequest,
  getMessagesWithUserRequest,
} from '../../api/rest/restController';

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendMessageRequest(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'message/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getConversationsRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchMessagesWithUser = createAsyncThunk(
  'message/fetchMessagesWithUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getMessagesWithUserRequest(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    conversations: [],
    activeChatMessages: [],
    loading: false,
    loadingChat: false,
    error: null,
  },
  reducers: {
    clearActiveChat: state => {
      state.activeChatMessages = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchConversations.pending, state => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessagesWithUser.pending, state => {
        state.loadingChat = true;
      })
      .addCase(fetchMessagesWithUser.fulfilled, (state, action) => {
        state.loadingChat = false;
        state.activeChatMessages = action.payload;
      })
      .addCase(fetchMessagesWithUser.rejected, (state, action) => {
        state.loadingChat = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.activeChatMessages.push(action.payload);
      });
  },
});

export const { clearActiveChat } = messageSlice.actions;
export default messageSlice.reducer;
