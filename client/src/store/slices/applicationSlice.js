import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createApplicationRequest,
  getMyApplicationsRequest,
  getApplicationsForCastingRequest,
  respondToApplicationRequest,
  getAgencyApplicationsRequest,
  downloadInviteRequest,
  downloadRejectionRequest,
} from '../../api/rest/restController';

export const createApplication = createAsyncThunk(
  'application/createApplication',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createApplicationRequest(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'application/fetchMyApplications',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await getMyApplicationsRequest(page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchApplicationsForCasting = createAsyncThunk(
  'application/fetchApplicationsForCasting',
  async (castingId, { rejectWithValue }) => {
    try {
      const res = await getApplicationsForCastingRequest(castingId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchAgencyApplications = createAsyncThunk(
  'application/fetchAgencyApplications',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await getAgencyApplicationsRequest(page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const respondToApplication = createAsyncThunk(
  'application/respondToApplication',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await respondToApplicationRequest(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const downloadInvite = createAsyncThunk(
  'application/downloadInvite',
  async ({ id, fileName }, { rejectWithValue }) => {
    try {
      const res = await downloadInviteRequest(id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', fileName || `invite_${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Error downloading file'
      );
    }
  }
);

export const downloadRejection = createAsyncThunk(
  'application/downloadRejection',
  async ({ id, fileName }, { rejectWithValue }) => {
    try {
      const res = await downloadRejectionRequest(id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', fileName || `rejection_${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Error downloading rejection letter'
      );
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    myApplications: [],
    castingApplications: [],
    agencyApplications: [],

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    loading: false,
    downloadLoading: false,
    error: null,
  },
  reducers: {
    clearCastingApplications: state => {
      state.castingApplications = [];
    },
    clearAgencyApplications: state => {
      state.agencyApplications = [];
    },
    clearApplicationsList: state => {
      state.myApplications = [];
      state.agencyApplications = [];
      state.currentPage = 1;
      state.totalItems = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyApplications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          const { data, totalItems, totalPages, currentPage } = action.payload;
          state.myApplications = data || [];
          state.totalItems = totalItems || 0;
          state.totalPages = totalPages || 0;
          state.currentPage = Number(currentPage) || 1;
        }
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createApplication.fulfilled, (state, action) => {
        state.myApplications.unshift(action.payload);
      })

      .addCase(fetchApplicationsForCasting.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsForCasting.fulfilled, (state, action) => {
        state.loading = false;
        state.castingApplications = action.payload;
      })
      .addCase(fetchApplicationsForCasting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAgencyApplications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyApplications.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          const { data, totalItems, totalPages, currentPage } = action.payload;
          state.agencyApplications = data || [];
          state.totalItems = totalItems || 0;
          state.totalPages = totalPages || 0;
          state.currentPage = Number(currentPage) || 1;
        }
      })
      .addCase(fetchAgencyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(respondToApplication.fulfilled, (state, action) => {
        const updatedApp = action.payload;

        const indexInCasting = state.castingApplications.findIndex(
          app => app.APP_ID === updatedApp.APP_ID
        );
        if (indexInCasting !== -1) {
          state.castingApplications[indexInCasting].APP_Status =
            updatedApp.APP_Status;
        }

        const indexInAgency = state.agencyApplications.findIndex(
          app => app.APP_ID === updatedApp.APP_ID
        );
        if (indexInAgency !== -1) {
          state.agencyApplications[indexInAgency].APP_Status =
            updatedApp.APP_Status;
        }
      })

      .addCase(downloadInvite.pending, state => {
        state.downloadLoading = true;
        state.error = null;
      })
      .addCase(downloadInvite.fulfilled, state => {
        state.downloadLoading = false;
      })
      .addCase(downloadInvite.rejected, (state, action) => {
        state.downloadLoading = false;
        state.error = action.payload;
      })

      .addCase(downloadRejection.pending, state => {
        state.downloadLoading = true;
        state.error = null;
      })
      .addCase(downloadRejection.fulfilled, state => {
        state.downloadLoading = false;
      })
      .addCase(downloadRejection.rejected, (state, action) => {
        state.downloadLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCastingApplications,
  clearAgencyApplications,
  clearApplicationsList,
} = applicationSlice.actions;
export default applicationSlice.reducer;
