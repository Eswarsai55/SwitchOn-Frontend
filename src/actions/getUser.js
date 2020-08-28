import AXIOS from '../utils/Axios';

const getUser = () => {
  return AXIOS.SERVER.get('/user').then(response => {
    return response.data.data;
  }).catch(err => {
    console.log(err);
  })
}

export default getUser;