import AXIOS from '../utils/Axios';
import {
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from '../actions/constants/types'

const getUser = () => {
  return (dispatch) => {
    return AXIOS.SERVER.get('/user')
    .then(xhrResponse => {
      const response = xhrResponse.data;
      if (response.error) {
        const message = response.message || 'Failed to fetch user data';
        dispatch({type: FETCH_USERS_FAILURE, message});
        return;
      }
      const { data } = xhrResponse.data;
      dispatch({type:FETCH_USERS_SUCCESS, data})
    }).catch(xhrResponse => {
      const response = xhrResponse.data || {};
      const message = (response && response.message) || 'Failed to fetch user data';
      dispatch({type: FETCH_USERS_FAILURE, message});
    })
  }
}

export default getUser;