import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import modelReducer from './slices/modelSlice';
import agencyReducer from './slices/agencySlice';

const rootReducer = combineReducers({
  agency: agencyReducer,
  auth: authReducer,
  model: modelReducer,
});

export default rootReducer;
