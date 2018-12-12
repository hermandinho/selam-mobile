import * as TYPES from './action_types'

let actions = {
    test: (store, data) => {
        store.commit(TYPES.TEST, data)
    },
    setPusherInstance: (store, instance) => {
        store.commit(TYPES.PUSHER_INSTANCE, instance)
    },
    setPusherChannel: (store, channel) => {
        store.commit(TYPES.PUSHER_CHANNEL, channel)
    },
    setNetWorkStatus: (store, status) => {
        store.commit(TYPES.SET_NETWORK_STATE, status)
    },
};

export default actions;
