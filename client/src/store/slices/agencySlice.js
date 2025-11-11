import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllAgenciesRequest,
  getAgencyByIdRequest,
  getAgencyProfileRequest,
  updateAgencyProfileRequest,
  updateAgencyLogoRequest,
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

export const fetchAgencyProfile = createAsyncThunk(
  'agency/fetchAgencyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAgencyProfileRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const saveAgencyProfile = createAsyncThunk(
  'agency/saveAgencyProfile',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      await updateAgencyProfileRequest(data);
      const res = await dispatch(fetchAgencyProfile());
      return res.payload;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const uploadAgencyLogo = createAsyncThunk(
  'agency/uploadAgencyLogo',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      await updateAgencyLogoRequest(formData);
      const res = await dispatch(fetchAgencyProfile());
      return res.payload;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

const agencySlice = createSlice({
  name: 'agency',
  initialState: {
    data: null,
    allAgencies: [],
    selectedAgency: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedAgency: state => {
      state.selectedAgency = null;
    },
    clearAgencyProfile: state => {
      state.data = null;
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
      })

      .addCase(fetchAgencyProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAgencyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      })
      .addCase(saveAgencyProfile.pending, state => {
        state.loading = true;
      })
      .addCase(saveAgencyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveAgencyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadAgencyLogo.pending, state => {
        state.loading = true;
      })
      .addCase(uploadAgencyLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadAgencyLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedAgency, clearAgencyProfile } = agencySlice.actions;
export default agencySlice.reducer;
