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
  async () => {
    const res = await getAllModelsRequest();
    return res.data;
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
    selectedModel: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // --- Профіль ---
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

      // --- Усі моделі ---
      .addCase(fetchAllModels.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAllModels.fulfilled, (state, action) => {
        state.loading = false;
        state.allModels = action.payload;
      })
      .addCase(fetchAllModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- Деталі конкретної моделі ---
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

export default modelSlice.reducer;
