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
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllCastingsRequest();
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
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyCastingsRequest();
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
    selectedCasting: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCasting: state => {
      state.selectedCasting = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCastings.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllCastings.fulfilled, (state, action) => {
        state.loading = false;
        state.allCastings = action.payload;
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
      })
      .addCase(fetchMyCastings.fulfilled, (state, action) => {
        state.loading = false;
        state.myCastings = action.payload;
      })
      .addCase(fetchMyCastings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCasting.fulfilled, (state, action) => {
        state.myCastings.push(action.payload);
      })
      .addCase(updateCasting.fulfilled, (state, action) => {
        const index = state.myCastings.findIndex(
          c => c.CST_ID === action.payload.CST_ID
        );
        if (index !== -1) {
          state.myCastings[index] = action.payload;
        }
        if (state.selectedCasting?.CST_ID === action.payload.CST_ID) {
          state.selectedCasting = action.payload;
        }
      })
      .addCase(deleteCasting.fulfilled, (state, action) => {
        state.myCastings = state.myCastings.filter(
          c => c.CST_ID !== action.payload
        );
      });
  },
});

export const { clearSelectedCasting } = castingSlice.actions;
export default castingSlice.reducer;
