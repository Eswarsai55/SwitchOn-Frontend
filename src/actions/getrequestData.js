import AXIOS from '../utils/Axios';
import {
  FETCH_REQUEST_FAILURE,
  FETCH_REQUEST_SUCCESS,
} from '../actions/constants/types';

const getRequestData = () => {
  return (dispatch) => {
    return AXIOS.SERVER.get('/request')
    .then(xhrResponse => {
      const response = xhrResponse.data;
      if (response.error) {
        const message = response.message || 'Failed to fetch request data';
        dispatch({type: FETCH_REQUEST_FAILURE, message});
        return;
      }
      const { data } = xhrResponse.data;
      dispatch({type:FETCH_REQUEST_SUCCESS, data})
    }).catch(xhrResponse => {
      const response = xhrResponse.data || {};
      const message = (response && response.message) || 'Failed to fetch request data';
      dispatch({type: FETCH_REQUEST_FAILURE, message});
    })
  }
}

export default getRequestData;