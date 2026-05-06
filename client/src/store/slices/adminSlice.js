import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAdminUsersRequest,
  changeAdminUserStatusRequest,
  getAdminCastingsRequest,
  changeAdminCastingStatusRequest,
  getAdminStatsRequest,
  getAdminStatisticsRequest,
  getAdminInvitationsRequest,
  getAdminReportsRequest,
  updateAdminReportStatusRequest,
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

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminStatsRequest();
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
  async (
    { status, page = 1, limit = 12, search = '' } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await getAdminCastingsRequest(status, page, limit, search);
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

export const fetchAdminStatistics = createAsyncThunk(
  'admin/fetchAdminStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminStatisticsRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminInvitations = createAsyncThunk(
  'admin/fetchAdminInvitations',
  async ({ page = 1, limit = 12, status = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await getAdminInvitationsRequest(page, limit, status);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAdminReports = createAsyncThunk(
  'admin/fetchAdminReports',
  async ({ page = 1, limit = 12, status = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await getAdminReportsRequest(page, limit, status);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const changeAdminReportStatus = createAsyncThunk(
  'admin/changeAdminReportStatus',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateAdminReportStatusRequest(id, data);
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

    invitations: [],
    invitationsTotalItems: 0,
    invitationsTotalPages: 0,
    invitationsCurrentPage: 1,

    reports: [],
    reportsTotalItems: 0,
    reportsTotalPages: 0,
    reportsCurrentPage: 1,

    loading: false,
    error: null,

    stats: {
      totalModels: 0,
      totalAgencies: 0,
      activeCastings: 0,
      pendingUsers: 0,
    },

    statistics: {
      kpi: {
        totalUsers: 0,
        totalModels: 0,
        totalAgencies: 0,
        activeCastings: 0,
        totalConnections: 0,
      },
      users: {
        modelsByStatus: {},
        agenciesByStatus: {},
      },
      demographics: {
        genderRatio: {},
      },
      economy: {
        castingsByStatus: {},
        applicationsByStatus: {},
        invitationsByStatus: {},
      },
      content: {
        totalAlbums: 0,
        totalPhotos: 0,
      },
    },
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
    clearAdminInvitationsList: state => {
      state.invitations = [];
      state.invitationsCurrentPage = 1;
      state.invitationsTotalItems = 0;
      state.invitationsTotalPages = 0;
    },
    // --- CLEAR REPORTS ---
    clearAdminReportsList: state => {
      state.reports = [];
      state.reportsCurrentPage = 1;
      state.reportsTotalItems = 0;
      state.reportsTotalPages = 0;
    },
  },
  extraReducers: builder => {
    builder
      // USERS
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

      // CASTINGS
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
      })

      // INVITATIONS
      .addCase(fetchAdminInvitations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminInvitations.fulfilled, (state, action) => {
        state.loading = false;
        const { data, totalItems, totalPages, currentPage } = action.payload;
        state.invitations = data;
        state.invitationsTotalItems = totalItems;
        state.invitationsTotalPages = totalPages;
        state.invitationsCurrentPage = Number(currentPage);
      })
      .addCase(fetchAdminInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // --- REPORTS ---
      .addCase(fetchAdminReports.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.loading = false;
        const { data, totalItems, totalPages, currentPage } = action.payload;
        state.reports = data;
        state.reportsTotalItems = totalItems;
        state.reportsTotalPages = totalPages;
        state.reportsCurrentPage = Number(currentPage);
      })
      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(changeAdminReportStatus.fulfilled, (state, action) => {
        const updatedReport = action.payload;
        const index = state.reports.findIndex(
          r => r.RPT_ID === updatedReport.RPT_ID
        );
        if (index !== -1) {
          state.reports[index].RPT_Status = updatedReport.RPT_Status;
          state.reports[index].RPT_AdminNotes = updatedReport.RPT_AdminNotes;
        }
      })

      // STATS
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchAdminStatistics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchAdminStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearAdminUsersList,
  clearAdminCastingsList,
  clearAdminInvitationsList,
  clearAdminReportsList,
} = adminSlice.actions;

export default adminSlice.reducer;
