import Vue from "nativescript-vue";
import RadListView from 'nativescript-ui-listview/vue';
import Vuex from 'vuex';
import store from './vuex/store';

require("nativescript-localstorage");

//import VueDevtools from 'nativescript-vue-devtools'
//Vue.use(VueDevtools, { host: '192.168.1.180' });

//Vue.config.productionTip = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);
Vue.use(RadListView);
Vue.registerElement('Gradient', () => require('nativescript-gradient').Gradient);
Vue.registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

import App from "./components/App";
import Login from './components/page/LoginPage'

Vue.config.silent = true;

new Vue({
    store,
    template: `
        <Frame>
            <Login v-if="!isLoggedIn" />
            <App v-if="isLoggedIn" />
        </Frame>`,

    components: {
        App, Login
    },
    computed: {
        isLoggedIn: function () {
            return localStorage.getItem('token')
        }
    },
    mounted: function () {
    }
}).$start();
