import Vue from "nativescript-vue";
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
    test: 1,
    pusherInstance: null,
    pusherChannel: null,
    hasNetwork: false,
    chats: {},
    currentChatUser: null,
    currentConversationId: null,
};

const actions = require('./actions');
const getters = require('./getters');
const mutations = require('./mutations');

const store = new Vuex.Store({
    state,
    mutations: mutations.default,
    getters: getters.default,
    actions: actions.default,
    strict: process.env.NODE_ENV !== 'production'
});

export default store;
