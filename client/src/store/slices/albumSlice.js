import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getModelAlbumsRequest,
  createAlbumRequest,
  uploadAlbumPhotosRequest,
  deleteAlbumRequest,
  updateAlbumRequest,
  deleteAlbumPhotosRequest,
} from '../../api/rest/restController';

const getModelIdFromState = state => {
  return state.model?.data?.MOD_ID || state.album?.selectedModelId || null;
};

export const fetchModelAlbums = createAsyncThunk(
  'album/fetchModelAlbums',
  async modelId => {
    const res = await getModelAlbumsRequest(modelId);
    return res.data;
  }
);

export const createAlbum = createAsyncThunk(
  'album/createAlbum',
  async ({ modelId, values }, { dispatch }) => {
    const res = await createAlbumRequest(modelId, values);
    await dispatch(fetchModelAlbums(modelId));
    return res.data;
  }
);

export const uploadAlbumPhotos = createAsyncThunk(
  'album/uploadAlbumPhotos',
  async ({ albumId, files }, { dispatch, getState }) => {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    await uploadAlbumPhotosRequest(albumId, formData);

    const modelId = getModelIdFromState(getState());
    if (modelId) {
      await dispatch(fetchModelAlbums(modelId));
    }
    return albumId;
  }
);

export const deleteAlbum = createAsyncThunk(
  'album/deleteAlbum',
  async ({ albumId, modelId }, { dispatch }) => {
    await deleteAlbumRequest(albumId);
    if (modelId) await dispatch(fetchModelAlbums(modelId));
    return albumId;
  }
);

export const updateAlbumDetails = createAsyncThunk(
  'album/updateAlbumDetails',
  async ({ albumId, title, description }, { dispatch, getState }) => {
    const res = await updateAlbumRequest(albumId, { title, description });
    const modelId = getModelIdFromState(getState());
    if (modelId) {
      await dispatch(fetchModelAlbums(modelId));
    }
    return res.data;
  }
);

export const deleteAlbumPhotos = createAsyncThunk(
  'album/deleteAlbumPhotos',
  async ({ albumId, photoIds }, { dispatch, getState }) => {
    await deleteAlbumPhotosRequest(albumId, { photoIds });
    const modelId = getModelIdFromState(getState());
    if (modelId) {
      await dispatch(fetchModelAlbums(modelId));
    }
    return { albumId, photoIds };
  }
);

const initialState = {
  albums: [],
  loading: false,
  error: null,
  selectedModelId: null,
};

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    setSelectedAlbumId (state, action) {
      state.selectedModelId = action.payload;
    },
    clearAlbumError (state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchModelAlbums.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(fetchModelAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createAlbum.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, state => {})
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(uploadAlbumPhotos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAlbumPhotos.fulfilled, state => {})
      .addCase(uploadAlbumPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAlbum.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, state => {})
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateAlbumDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbumDetails.fulfilled, state => {})
      .addCase(updateAlbumDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteAlbumPhotos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbumPhotos.fulfilled, state => {})
      .addCase(deleteAlbumPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedAlbumId, clearAlbumError } = albumSlice.actions;
export default albumSlice.reducer;
