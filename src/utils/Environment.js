let apiEndpoint;

if (process.env.REACT_APP_ENV === 'production') {
    apiEndpoint = 'http://hbits.co:8000/api/';
} else if (process.env.REACT_APP_ENV === 'staging') {
    apiEndpoint = 'http://staging.hbits.co:8000/api/'
} else if  (process.env.REACT_APP_ENV === 'test') {
    apiEndpoint = 'http://test.hbits.co:8000/api/'
} else {
    apiEndpoint = 'http://localhost:9500/api';
}

export const baseUrl = apiEndpoint;
