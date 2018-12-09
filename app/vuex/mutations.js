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
};

export default mutations;
