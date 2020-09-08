import AXIOS from '../utils/Axios';
import {
  FETCH_DEPARTMENT_FAILURE,
  FETCH_DEPARTMENT_SUCCESS,
} from '../actions/constants/types';

const getDepartmentData = () => {
  return (dispatch) => {
    return AXIOS.SERVER.get('/department')
    .then(xhrResponse => {
      const response = xhrResponse.data;
      if (response.error) {
        const message = response.message || 'Failed to fetch department data';
        dispatch({type: FETCH_DEPARTMENT_FAILURE, message});
        return;
      }
      const { data } = xhrResponse.data;
      dispatch({type:FETCH_DEPARTMENT_SUCCESS, data})
    }).catch(xhrResponse => {
      const response = xhrResponse.data || {};
      const message = (response && response.message) || 'Failed to fetch department data';
      dispatch({type: FETCH_DEPARTMENT_FAILURE, message});
    })
  }
}

export default getDepartmentData;