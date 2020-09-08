import Store from '../store/request';
import {
  FETCH_REQUEST_SUCCESS,
  FETCH_REQUEST_FAILURE,
} from '../actions/constants/types';
const initialState = Store;

export default function requestReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_REQUEST_SUCCESS:
      return Object.assign({}, state, {
        requestData: action.data,
        error: null,
        fetching: false,
      });
    case FETCH_REQUEST_FAILURE:
      return Object.assign({}, state, {
        requestData: [],
        error: action.message,
        fetching: false,
      });
    default:
      return state;
  }
}