import Store from '../store/user';
import {
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE
} from '../actions/constants/types';
export const initialState = Store;

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_USERS_SUCCESS:
      return Object.assign({}, state, {
        userData: action.data,
        error: null,
        fetching: false,
      })
    case FETCH_USERS_FAILURE:
      return Object.assign({}, state, {
        error: action.message,
        userData: [],
        fetching: false,
      })
    
    default: 
      return state;
  }
}