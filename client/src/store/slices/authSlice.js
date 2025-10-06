import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginRequest,
  signupModelRequest,
  signupAgencyRequest,
} from '../../api/rest/restController';
import CONSTANTS from '../../utils/constants';

const AUTH_SLICE_NAME = 'auth';

const savedToken = localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
const savedUser = localStorage.getItem('user');

const initialState = {
  isFetching: false,
  error: null,
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: savedToken || null,
};

export const authenticateUser = createAsyncThunk(
  `${AUTH_SLICE_NAME}/authenticateUser`,
  async ({ authInfo, authMode }, { rejectWithValue }) => {
    try {
      let response;

      switch (authMode) {
        case CONSTANTS.AUTH_MODE.LOGIN:
          response = await loginRequest(authInfo);
          break;
        case CONSTANTS.AUTH_MODE.SIGNUP_MODEL:
          response = await signupModelRequest(authInfo);
          break;
        case CONSTANTS.AUTH_MODE.SIGNUP_AGENCY:
          response = await signupAgencyRequest(authInfo);
          break;
        default:
          throw new Error('Invalid auth mode');
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
      localStorage.removeItem('user');
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

        const { userId, role, accessToken } = action.payload;

        state.user = { userId, role };
        state.accessToken = accessToken;

        localStorage.setItem(CONSTANTS.ACCESS_TOKEN, accessToken);
        localStorage.setItem('user', JSON.stringify({ userId, role }));
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
