import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getModelProfileRequest,
  updateModelProfileRequest,
  updateModelPhotoRequest,
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

const modelSlice = createSlice({
  name: 'model',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
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
      });
  },
});

export default modelSlice.reducer;
