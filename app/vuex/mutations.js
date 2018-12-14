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
};

export default mutations;
