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
};

export default getters;
