import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import modelReducer from './slices/modelSlice';
import agencyReducer from './slices/agencySlice';
import albumReducer from './slices/albumSlice';

const rootReducer = combineReducers({
  agency: agencyReducer,
  auth: authReducer,
  model: modelReducer,
  album: albumReducer,
});

export default rootReducer;
