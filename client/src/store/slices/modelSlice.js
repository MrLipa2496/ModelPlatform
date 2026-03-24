import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getModelProfileRequest,
  updateModelProfileRequest,
  updateModelPhotoRequest,
  getAllModelsRequest,
  getModelByIdRequest,
} from '../../api/rest/restController';

export const fetchProfile = createAsyncThunk('model/fetchProfile', async () => {
  const res = await getModelProfileRequest();
  return res.data;
});

export const saveProfile = createAsyncThunk(
  'model/saveProfile',
  async values => {
    await updateModelProfileRequest(values);
    const res = await getModelProfileRequest();
    return res.data;
  }
);

export const uploadPhoto = createAsyncThunk('model/uploadPhoto', async file => {
  const formData = new FormData();
  formData.append('photo', file);
  await updateModelPhotoRequest(formData);
  const res = await getModelProfileRequest();
  return res.data;
});

export const fetchAllModels = createAsyncThunk(
  'model/fetchAllModels',
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const res = await getAllModelsRequest(page, limit);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchModelById = createAsyncThunk(
  'model/fetchModelById',
  async id => {
    const res = await getModelByIdRequest(id);
    return res.data;
  }
);

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    data: null,
    allModels: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    selectedModel: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearModelsList: state => {
      state.allModels = [];
      state.currentPage = 1;
      state.totalItems = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      .addCase(fetchAllModels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllModels.fulfilled, (state, action) => {
        state.loading = false;
        const { data, totalItems, totalPages, currentPage } = action.payload;

        state.allModels = data;
        state.totalItems = totalItems;
        state.totalPages = totalPages;
        state.currentPage = Number(currentPage);
      })
      .addCase(fetchAllModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchModelById.pending, state => {
        state.loading = true;
      })
      .addCase(fetchModelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedModel = action.payload;
      })
      .addCase(fetchModelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearModelsList } = modelSlice.actions;
export default modelSlice.reducer;
