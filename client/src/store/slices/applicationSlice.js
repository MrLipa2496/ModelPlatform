import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createApplicationRequest,
  getMyApplicationsRequest,
  getApplicationsForCastingRequest,
  respondToApplicationRequest,
  getAgencyApplicationsRequest,
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
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyApplicationsRequest();
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
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAgencyApplicationsRequest();
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

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    myApplications: [],
    castingApplications: [],
    agencyApplications: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCastingApplications: state => {
      state.castingApplications = [];
    },
    clearAgencyApplications: state => {
      state.agencyApplications = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyApplications.pending, state => {
        state.loading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.myApplications.push(action.payload);
      })

      .addCase(fetchApplicationsForCasting.pending, state => {
        state.loading = true;
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
      })
      .addCase(fetchAgencyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.agencyApplications = action.payload;
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
      });
  },
});

export const { clearCastingApplications, clearAgencyApplications } =
  applicationSlice.actions;
export default applicationSlice.reducer;
