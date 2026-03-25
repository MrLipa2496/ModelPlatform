import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAdminUsersRequest,
  changeAdminUserStatusRequest,
  getAdminCastingsRequest,
  changeAdminCastingStatusRequest,
} from '../../api/rest/restController';

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async ({ role, status, page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const res = await getAdminUsersRequest(role, status, page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const changeAdminUserStatus = createAsyncThunk(
  'admin/changeAdminUserStatus',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await changeAdminUserStatusRequest(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminCastings = createAsyncThunk(
  'admin/fetchAdminCastings',
  async ({ status, page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const res = await getAdminCastingsRequest(status, page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const changeAdminCastingStatus = createAsyncThunk(
  'admin/changeAdminCastingStatus',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await changeAdminCastingStatusRequest(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    usersTotalItems: 0,
    usersTotalPages: 0,
    usersCurrentPage: 1,

    castings: [],
    castingsTotalItems: 0,
    castingsTotalPages: 0,
    castingsCurrentPage: 1,

    loading: false,
    error: null,
  },
  reducers: {
    clearAdminUsersList: state => {
      state.users = [];
      state.usersCurrentPage = 1;
      state.usersTotalItems = 0;
      state.usersTotalPages = 0;
    },
    clearAdminCastingsList: state => {
      state.castings = [];
      state.castingsCurrentPage = 1;
      state.castingsTotalItems = 0;
      state.castingsTotalPages = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        const { data, totalItems, totalPages, currentPage } = action.payload;

        state.users = data;
        state.usersTotalItems = totalItems;
        state.usersTotalPages = totalPages;
        state.usersCurrentPage = Number(currentPage);
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(changeAdminUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const index = state.users.findIndex(u => u.USR_ID === userId);
        if (index !== -1) {
          if (state.users[index].MOD_Status !== undefined) {
            state.users[index].MOD_Status = status;
          } else if (state.users[index].AGN_Status !== undefined) {
            state.users[index].AGN_Status = status;
          }
        }
      })

      .addCase(fetchAdminCastings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCastings.fulfilled, (state, action) => {
        state.loading = false;
        const { data, totalItems, totalPages, currentPage } = action.payload;

        state.castings = data;
        state.castingsTotalItems = totalItems;
        state.castingsTotalPages = totalPages;
        state.castingsCurrentPage = Number(currentPage);
      })
      .addCase(fetchAdminCastings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(changeAdminCastingStatus.fulfilled, (state, action) => {
        const { castingId, status } = action.payload;
        const index = state.castings.findIndex(c => c.CST_ID === castingId);
        if (index !== -1) {
          state.castings[index].CST_Status = status;
        }
      });
  },
});

export const { clearAdminUsersList, clearAdminCastingsList } =
  adminSlice.actions;
export default adminSlice.reducer;
