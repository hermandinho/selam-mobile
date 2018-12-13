import Vue from "nativescript-vue";
import RadListView from 'nativescript-ui-listview/vue';
import Vuex from 'vuex';
import store from './vuex/store';
import moment from 'moment';

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

Vue.filter('currency', (value, symbol) => {
    if (typeof value === undefined || typeof symbol === undefined) return value;
    //return (value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' ' + symbol;
});

Vue.filter('toDate', (value) => {
    if (!value) return value;
    return moment(value).format('DD/MM/YYYY')
});

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
