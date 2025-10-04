import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginRequest,
  signupModelRequest,
  signupAgencyRequest,
} from '../../api/rest/restController';
import CONSTANTS from '../../utils/constants';

const AUTH_SLICE_NAME = 'auth';

const initialState = {
  isFetching: false,
  error: null,
  user: null,
  accessToken: null,
};

export const authenticateUser = createAsyncThunk(
  `${AUTH_SLICE_NAME}/authenticateUser`,
  async ({ authInfo, authMode }, { rejectWithValue }) => {
    try {
      let response;
      if (authMode === CONSTANTS.AUTH_MODE.LOGIN) {
        response = await loginRequest(authInfo);
      } else if (authMode === CONSTANTS.AUTH_MODE.SIGNUP_MODEL) {
        response = await signupModelRequest(authInfo);
      } else if (authMode === CONSTANTS.AUTH_MODE.SIGNUP_AGENCY) {
        response = await signupAgencyRequest(authInfo);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Server error');
    }
  }
);

const authSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(authenticateUser.pending, state => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isFetching = false;
        state.error = null;
        state.user = {
          userId: action.payload.userId,
          role: action.payload.role,
        };
        state.accessToken = action.payload.accessToken;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;

export default authSlice.reducer;
