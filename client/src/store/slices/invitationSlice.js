import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createInvitationRequest,
  getMySentInvitationsRequest,
  getMyInvitationsRequest,
  respondToInvitationRequest,
} from '../../api/rest/restController';

export const createInvitation = createAsyncThunk(
  'invitation/createInvitation',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createInvitationRequest(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchMySentInvitations = createAsyncThunk(
  'invitation/fetchMySentInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMySentInvitationsRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchMyInvitations = createAsyncThunk(
  'invitation/fetchMyInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyInvitationsRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const respondToInvitation = createAsyncThunk(
  'invitation/respondToInvitation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await respondToInvitationRequest(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

const invitationSlice = createSlice({
  name: 'invitation',
  initialState: {
    myInvitations: [],
    sentInvitations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMyInvitations.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMyInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.myInvitations = action.payload;
      })
      .addCase(fetchMyInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(respondToInvitation.fulfilled, (state, action) => {
        const index = state.myInvitations.findIndex(
          inv => inv.INV_ID === action.payload.INV_ID
        );
        if (index !== -1) {
          state.myInvitations[index].INV_Status = action.payload.INV_Status;
        }
      })
      .addCase(fetchMySentInvitations.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMySentInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.sentInvitations = action.payload;
      })
      .addCase(fetchMySentInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvitation.fulfilled, (state, action) => {
        state.sentInvitations.push(action.payload);
      });
  },
});

export default invitationSlice.reducer;
