import * as TYPES from './action_types'

let getters = {
    getTest: (state) => {
        return state.test;
    },
    getPusherInstance: (state) => {
        return state.pusherInstance;
    },
    getPusherChannel: (state) => {
        return state.pusherChannel;
    },
    getNetWorkStatus: (state) => {
        return state.hasNetwork;
    },
    getCurrentChatUser: (state) => {
        return state.currentChatUser;
    },
    getCurrentConversationId: (state) => {
        return state.currentConversationId;
    },
    getCurrentChatMessages: (state) => {
        if (!state.currentConversationId || !state.chats[state.currentConversationId]) return [];
        return state.chats[state.currentConversationId].messages;
    },
    getChatUsers: (state) => {
        return state.chatUsers;
    },
    getTypers: (state) => {
        return state.typers;
    },
    getSearchFilters: (state) => {
        return state.searchFilters;
    },
    getCategories: (state) => {
        return state.categories;
    },
    getSubCategories: (state) => {
        return state.subCategories;
    },
};

export default getters;
