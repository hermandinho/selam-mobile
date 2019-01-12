import axios from 'axios';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import store from './vuex/store'
import actions from './vuex/actions'

const API_BASE_URL = "https://selammobile-api.serveo.net/api/v1";
//const API_BASE_URL = "https://selam-mobile.herokuapp.com/api/v1";
// const API_BASE_URL = "https://selam.tech/api/v1";

const unregisterFromPush = () => {
    messaging.unregisterForPushNotifications().then(res => {
        console.log('UNREGISTERED FROM PUSH')
    });
};

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
    if (401 === error.response.status && error.config.url.indexOf('logout') === -1 && error.config.url.indexOf('login') === -1) {
        unregisterFromPush();
        alert("Votre session a expirée. Véillez vous re-connecter").then(res => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            actions.redirectToLogin(store, {});
        });
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

let logout = (params) => {
    unregisterFromPush();
    return axios.post(API_BASE_URL + '/user/logout', params);
};

let register = (params) => {
    return axios.post(API_BASE_URL + '/user/signup', params)
};

let updateProfile = (id, params) => {
    return axios.patch(API_BASE_URL + '/user/' + id, params)
};

let updatePushToken = (params) => {
    return axios.patch(API_BASE_URL + '/user/push-token/set', params)
};

let fetchConfigFilters = () => {
    return axios.get(API_BASE_URL + '/config/filters')
};

let fetchArticles = (params) => {
    let q = '';
    if (params.page)
        q += '?page=' + params.page;
    if (params.limit)
        q += '&limit=' + params.limit;
    if (params.dateSort)
        q += '&dateSort=' + params.dateSort;
    if (params.priceSort)
        q += '&priceSort=' + params.priceSort;
    if (params.region && params.region.length)
        q += '&region=' + params.region;
    if (params.priceFixed && params.priceFixed)
        q += '&priceFixed=' + params.priceFixed;
    if (params.exchange && params.exchange)
        q += '&exchange=' + params.exchange;
    if (params.search && params.search.trim().length)
        q += '&search=' + params.search;

    return axios.get(API_BASE_URL + '/article' + q);
};

let findArticle = (id) => {
    return axios.get(API_BASE_URL + '/article/' + id);
};

let createArticle = (params) => {
    return axios.post(API_BASE_URL + '/article/create', params);
};

let sendMessage = (receiver, params) => {
    return axios.post(API_BASE_URL + '/message/' + receiver + '/send', params);
};

let sendTypingEvent = (cid, status, uid) => {
    return axios.get(API_BASE_URL + '/user/' + cid + '/' + status + '/typing?uid=' + uid);
};

let fetchMessages = (receiver) => {
    return axios.get(API_BASE_URL + '/message/' + receiver + '/fetch');
};

let fetchConversations = (params) => {
    let q = '';
    if (params.page)
        q += '?page=' + params.page;
    return axios.get(API_BASE_URL + '/conversation' + q);
};

let deleteConversations = (ids) => {
    return axios.delete(API_BASE_URL + '/conversation/' + ids.join(','));
};

export default{
    getAPIBaseURL,
    login,
    logout,
    register,
    updateProfile,
    updatePushToken,
    fetchConfigFilters,
    createArticle,
    fetchArticles,
    findArticle,
    sendMessage,
    fetchMessages,
    fetchConversations,
    deleteConversations,
    sendTypingEvent
};
