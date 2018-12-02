import Vue from "nativescript-vue";
import RadListView from 'nativescript-ui-listview/vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.use(RadListView);

import App from "./components/App";

Vue.config.silent = false;

new Vue({
    template: `
        <Frame>
            <App />
        </Frame>`,

    components: {
        App
    }
}).$start();
