import AXIOS from '../utils/Axios';

const getRequestData = () => {
  return AXIOS.SERVER.get('/request').then(response => {
    return response.data.data;
  }).catch(err => {
    console.log(err);
  })
}

export default getRequestData;