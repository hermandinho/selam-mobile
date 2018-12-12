import axios from 'axios';
const API_BASE_URL = "https://selammobile-api.serveo.net/api/v1";

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(err);
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (401 === error.response.status) {
        alert("Votre session a expirée. Véillez vous re-connecter");
    } else {
        return Promise.reject(error);
    }
});

let getAPIBaseURL = () => {
    return API_BASE_URL;
};

let login = (params) => {
    return axios.post(API_BASE_URL + '/user/login', params)
};

let register = (params) => {
    return axios.post(API_BASE_URL + '/user/signup', params)
};

let fetchConfigFilters = () => {
    return axios.get(API_BASE_URL + '/config/filters')
};

let createArticle = (params) => {
    return axios.post(API_BASE_URL + '/article/create', params);
};

export default{
    getAPIBaseURL,
    login,
    register,
    fetchConfigFilters,
    createArticle
};
