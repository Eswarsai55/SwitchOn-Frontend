import Store from '../store/department';
import {
  FETCH_DEPARTMENT_SUCCESS,
  FETCH_DEPARTMENT_FAILURE
} from '../actions/constants/types';
const intialState = Store;

export default function departmentReducer(state = intialState, action) {
  switch(action.type) {
    case FETCH_DEPARTMENT_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        error: null,
        departmentData: action.data,
      })
    case FETCH_DEPARTMENT_FAILURE:
      return Object.assign({}, state, {
        fetching: false,
        error: action.message,
        departmentData: []
      })
    default:
      return state;
  }
}