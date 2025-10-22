import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import modelReducer from './slices/modelSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  model: modelReducer,
});

export default rootReducer;
