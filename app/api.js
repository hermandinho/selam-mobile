import axios from 'axios';

const API_BASE_URL = "http://d78d19c9.ngrok.io/api/v1";

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