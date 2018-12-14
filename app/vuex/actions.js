import * as TYPES from './action_types'

let actions = {
    test: (store, data) => {
        store.commit(TYPES.TEST, data);
    },
    setPusherInstance: (store, instance) => {
        store.commit(TYPES.PUSHER_INSTANCE, instance);
    },
    setPusherChannel: (store, channel) => {
        store.commit(TYPES.PUSHER_CHANNEL, channel);
    },
    setNetWorkStatus: (store, status) => {
        store.commit(TYPES.SET_NETWORK_STATE, status);
    },
    setCurrentChatUser: (store, user) => {
        store.commit(TYPES.SET_CURRENT_CHAT_USER, user);
    },
    setCurrentConversationId: (store, id) => {
        store.commit(TYPES.SET_CURRENT_CONVERSATION_ID, id);
    },
    receivedMessage: (store, message) => {
        store.commit(TYPES.RECEIVED_MESSAGE, message);
    },
    fetchedConversationMessages: (store, data) => {
        store.commit(TYPES.FETCHED_CONVERSATION_MESSAGES, data);
    },
};

export default actions;
