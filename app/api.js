import axios from 'axios';

const API_BASE_URL = "https://selammobile-api.serveo.net/api/v1";

let login = (params) => {
    return axios.post(API_BASE_URL + '/user/login', params)
};

let register = (params) => {
    return axios.post(API_BASE_URL + '/user/signup', params)
};

export default{
    login,
    register
};
