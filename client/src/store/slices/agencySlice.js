import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllAgenciesRequest,
  getAgencyByIdRequest,
} from '../../api/rest/restController';

export const fetchAllAgencies = createAsyncThunk(
  'agency/fetchAllAgencies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAgenciesRequest();
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch agencies'
      );
    }
  }
);

export const fetchAgencyById = createAsyncThunk(
  'agency/fetchAgencyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAgencyByIdRequest(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch agency'
      );
    }
  }
);

const agencySlice = createSlice({
  name: 'agency',
  initialState: {
    allAgencies: [],
    selectedAgency: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedAgency: state => {
      state.selectedAgency = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllAgencies.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAgencies.fulfilled, (state, action) => {
        state.loading = false;
        state.allAgencies = action.payload;
      })
      .addCase(fetchAllAgencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAgencyById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAgency = action.payload;
      })
      .addCase(fetchAgencyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedAgency } = agencySlice.actions;
export default agencySlice.reducer;
