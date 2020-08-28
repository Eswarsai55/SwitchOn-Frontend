const deleteToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
};

const getToken = () => {
    return localStorage.getItem('access_token');
};

const getUserName = () => {
    return localStorage.getItem('user_name');
};

export {getToken, deleteToken, getUserName};
