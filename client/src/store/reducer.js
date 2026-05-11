import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import modelReducer from './slices/modelSlice';
import agencyReducer from './slices/agencySlice';
import albumReducer from './slices/albumSlice';
import castingReducer from './slices/castingSlice';
import applicationReducer from './slices/applicationSlice';
import invitationReducer from './slices/invitationSlice';
import messageReducer from './slices/messageSlice';
import adminReducer from './slices/adminSlice';
import reportReducer from './slices/reportSlice';

const rootReducer = combineReducers({
  admin: adminReducer,
  agency: agencyReducer,
  auth: authReducer,
  model: modelReducer,
  album: albumReducer,
  casting: castingReducer,
  application: applicationReducer,
  invitation: invitationReducer,
  message: messageReducer,
  report: reportReducer,
});

export default rootReducer;
