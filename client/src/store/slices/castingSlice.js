import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCastingsRequest,
  getCastingByIdRequest,
  createCastingRequest,
  updateCastingRequest,
  deleteCastingRequest,
  getMyCastingsRequest,
} from '../../api/rest/restController';

export const fetchAllCastings = createAsyncThunk(
  'casting/fetchAllCastings',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await getAllCastingsRequest(page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchCastingById = createAsyncThunk(
  'casting/fetchCastingById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await getCastingByIdRequest(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const fetchMyCastings = createAsyncThunk(
  'casting/fetchMyCastings',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await getMyCastingsRequest(page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const createCasting = createAsyncThunk(
  'casting/createCasting',
  async (data, { rejectWithValue }) => {
    try {
      const res = await createCastingRequest(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const updateCasting = createAsyncThunk(
  'casting/updateCasting',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCastingRequest(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

export const deleteCasting = createAsyncThunk(
  'casting/deleteCasting',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCastingRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error');
    }
  }
);

const castingSlice = createSlice({
  name: 'casting',
  initialState: {
    allCastings: [],
    myCastings: [],

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    selectedCasting: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCasting: state => {
      state.selectedCasting = null;
    },
    clearCastingsList: state => {
      state.allCastings = [];
      state.myCastings = [];
      state.currentPage = 1;
      state.totalItems = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCastings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCastings.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          const { data, totalItems, totalPages, currentPage } = action.payload;
          state.allCastings = data || [];
          state.totalItems = totalItems || 0;
          state.totalPages = totalPages || 0;
          state.currentPage = Number(currentPage) || 1;
        }
      })
      .addCase(fetchAllCastings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCastingById.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCastingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCasting = action.payload;
      })
      .addCase(fetchCastingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyCastings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCastings.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          const { data, totalItems, totalPages, currentPage } = action.payload;
          state.myCastings = data || [];
          state.totalItems = totalItems || 0;
          state.totalPages = totalPages || 0;
          state.currentPage = Number(currentPage) || 1;
        }
      })
      .addCase(fetchMyCastings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCasting.fulfilled, (state, action) => {
        state.myCastings.unshift(action.payload);
      })
      .addCase(updateCasting.fulfilled, (state, action) => {
        const index = state.myCastings.findIndex(
          c => c.CST_ID === action.payload.CST_ID
        );
        if (index !== -1) {
          state.myCastings[index] = action.payload;
        }
        const publicIndex = state.allCastings.findIndex(
          c => c.CST_ID === action.payload.CST_ID
        );
        if (publicIndex !== -1) {
          state.allCastings[publicIndex] = action.payload;
        }

        if (state.selectedCasting?.CST_ID === action.payload.CST_ID) {
          state.selectedCasting = action.payload;
        }
      })
      .addCase(deleteCasting.fulfilled, (state, action) => {
        state.myCastings = state.myCastings.filter(
          c => c.CST_ID !== action.payload
        );
        state.allCastings = state.allCastings.filter(
          c => c.CST_ID !== action.payload
        );
      });
  },
});

export const { clearSelectedCasting, clearCastingsList } = castingSlice.actions;
export default castingSlice.reducer;
