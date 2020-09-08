import { combineReducers } from 'redux';
import user from './reducers/user';
import request from './reducers/request';
import department from './reducers/department';

export default combineReducers({
  user,
  request,
  department,
})