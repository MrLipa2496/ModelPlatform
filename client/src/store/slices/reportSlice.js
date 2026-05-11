import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createReportRequest,
  getMyReportsRequest,
} from '../../api/rest/restController';

export const submitReport = createAsyncThunk(
  'report/submitReport',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createReportRequest(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchMyReports = createAsyncThunk(
  'report/fetchMyReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyReportsRequest();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    myReports: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearReportStatus: state => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitReport.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myReports.unshift(action.payload);
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit report';
        state.success = false;
      })

      .addCase(fetchMyReports.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.myReports = action.payload;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load reports history';
      });
  },
});

export const { clearReportStatus } = reportSlice.actions;
export default reportSlice.reducer;
