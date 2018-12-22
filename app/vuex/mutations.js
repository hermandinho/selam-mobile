import Vue from 'nativescript-vue'
import * as TYPES from './action_types'

let mutations = {
    [TYPES.TEST]: (state, data) => {
        state.test += data;
    },
    [TYPES.PUSHER_INSTANCE]: (state, instance) => {
        state.pusherInstance = instance;
    },
    [TYPES.PUSHER_CHANNEL]: (state, channel) => {
        state.pusherChannel = channel;
    },
    [TYPES.SET_NETWORK_STATE]: (state, status) => {
        state.hasNetwork = status;
    },
    [TYPES.SET_CURRENT_CHAT_USER]: (state, user) => {
        state.currentChatUser = user;
    },
    [TYPES.SET_CURRENT_CONVERSATION_ID]: (state, id) => {
        state.currentConversationId = id;
    },
    [TYPES.FETCHED_CONVERSATION_MESSAGES]: (state, data) => {
        if (!data || !data[0] || !data[0].conversation) return;
        if (!state.chats[data[0].conversation]) {
            Vue.set(state.chats, data[0].conversation, { messages: [], fetched: true });
        }

        state.chats[data[0].conversation].messages = data;
    },
    [TYPES.RECEIVED_MESSAGE]: (state, message) => {
        if (!message) return;
        if (!state.chats[message.conversation]) {
            Vue.set(state.chats, message.conversation, { messages: [], fetched: false });
        }
        state.chats[message.conversation].messages.push(message);
    },
    [TYPES.FETCHED_CHAT_USERS]: (state, data) => {
        state.chatUsers = data;
    },
    [TYPES.RECEIVED_TYPING_EVENT]: (state, data) => {
        if (!data || !data.hasOwnProperty('status')) return;
        if (data.status) {
            state.typers.push(data.user);
        } else {
            state.typers = state.typers.filter(t => t !== data.user);
        }
    },
    [TYPES.DELETED_CONVERSATIONS]: (state, data) => {
        if (!data || !data.length) return;
        state.chatUsers = state.chatUsers.filter(u => data.indexOf(u._id) === -1);
        state.chatUsers = [];
    },
    [TYPES.FETCHED_SEARCH_FILTERS]: (state, data) => {
        if (!data) return;
        state.searchFilters.countries = data.countries || [];
        state.searchFilters.towns = data.towns || [];
        state.categories = data.categories || [];
        state.subCategories = data.subCategories || [];
    },
    [TYPES.TOGGLE_TOWN_COUNTRY]: (state, data) => {
        if (!data) return;
        state.searchFilters.selectedCountry = data;
    },
    [TYPES.TOGGLE_SEARCH_OPTION]: (state, data) => {
        if (!data) return;
        state.searchFilters.options[data.key] = data.value;
    },
    [TYPES.TOGGLE_TOWN_SELECT]: (state, data) => {
        if (!data) {
            state.searchFilters.selectedTowns = []
        } else {
            let check = state.searchFilters.selectedTowns.filter(t => t._id === data._id);
            if (!check.length)
                state.searchFilters.selectedTowns.push(data);
            else {
                state.searchFilters.selectedTowns = state.searchFilters.selectedTowns.filter(t => t._id !== data._id)
            }
        }
    },
};

export default mutations;
