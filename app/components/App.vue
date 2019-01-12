<template>
    <Page class="page" actionBarHidden="true" @loaded="onLoaded" @navigatedTo="OnNavigatedTo" @unLoaded="OnUnloaded">
        <TabView
                id="main-tab"
                :selectedIndex="1"
                androidTabsPosition="bottom"
                androidSelectedTabHighlightColor="#ffffff"
                tabBackgroundColor="#ec4980"
                @selectedIndexChange="tabChanged"
                iosIconRenderingMode="alwaysOriginal"
                selectedTabTextColor="#ffffff"
                @loaded="onTabViewLoaded"
                @unloaded="onTabViewUnloaded">
            <TabViewItem bageValue="50" title="" :iconSource="selectedIndex === 0 ? 'res://ic_tab_chat_white' : 'res://ic_tab_chat_black'">
                <Frame id="chatFrame">
                    <chat-list-page @openedChat="handleOpenedChat" @closedChat="handleClosedChat"></chat-list-page>
                </Frame>
            </TabViewItem>
            <TabViewItem bageValue="1" title="" :iconSource="selectedIndex === 1 ? 'res://ic_tab_shopping_bag_white' : 'res://ic_tab_shopping_bag_black'">
                <Frame id="articlesFrame">
                    <articles-list-page></articles-list-page>
                </Frame>
            </TabViewItem>
            <TabViewItem :bageValue="0" title="" :iconSource="selectedIndex === 2 ? 'res://ic_tab_settings_white' : 'res://ic_tab_settings_black'">
                <Frame id="settingsFrame">
                    <settings-page></settings-page>
                </Frame>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script>
    import * as app from 'tns-core-modules/application'
    import { messaging, Message } from "nativescript-plugin-firebase/messaging";
    const connectivityModule = require("tns-core-modules/connectivity");
    import * as platform from 'tns-core-modules/platform';
    import {Pusher} from 'nativescript-pusher';
    import Vuex from 'vuex';
    import ChatListPage from './page/ChatList';
    import ArticlesListPage from './page/ArticlesListPage';
    import SettingsPage from './page/SettingsPage';
    import LoginPage from './page/LoginPage'
    // import {isAndroid, isIOS} from 'platform';
    import {ContentView} from 'ui/content-view';
    import {Label} from 'ui/label';
    import API from '../api';
    import LIBS from '../libs';

    export default {
        name: 'app',
        data: function () {
            return {
                selectedIndex: 0,
                uuid: null,
                pusherConnected: false,
                tabViewLayout: null,
                tabView: null,
                tabHeight: 145,
                unreadMessages: {}
            }
        },
        watch: {
            isLoggedOut: function (n) {
                if (n) {
                    this.$navigateTo(LoginPage, {
                        animated: true,
                        clearHistory: true,
                        frame: 'mainFrame'
                    });
                }
            }
        },
        computed: {
            ...Vuex.mapGetters(['getPusherInstance', 'getPusherChannel', 'getNetWorkStatus', 'isLoggedOut']),
            getToken: function () {
                return localStorage.getItem('token');
            },
            me: function () {
                const user = localStorage.getItem('user');
                if (!user) return;
                return JSON.parse(user);
            },
            countUnreadConversations: function () {
                let count = 0;
                for (let cv in this.unreadMessages) {
                    count ++;
                }
                return count;
            }
        },
        methods: {
            ...Vuex.mapActions(['setPusherInstance',
                'setPusherChannel',
                'setNetWorkStatus',
                'receivedMessage',
                'receivedTypingEvent',
                'updateConversationUnreadCount'
            ]),
            tabChanged: function (index) {
                this.selectedIndex = index.value;
                if (this.selectedIndex === 0) {
                    const nativeTabView = this.tabView._tabLayout.getChildAt(0);
                    const view = nativeTabView.getChildAt(0);
                    this.removeBadges(this.tabView, 0, view);
                }
            },
            onLoaded: function () {
                this.uuid = platform.device.uuid;
            },
            handleOpenedChat: function () {
                if (this.tabViewLayout) {
                    setTimeout(() => {
                        this.tabHeight = this.tabViewLayout.getHeight();
                        this.tabViewLayout.getLayoutParams().height = 0;
                        // this.tabViewLayout.getLayoutParams().visibility = 'hidden';
                        this.tabViewLayout.requestLayout();
                    })
                }
            },
            handleClosedChat: function () {
                if (this.tabViewLayout) {
                    this.tabViewLayout.getLayoutParams().height = this.tabHeight;
                    this.tabViewLayout.requestLayout();
                }
            },
            onTabViewLoaded: function ({object}) {
                if (platform.isAndroid) {
                    this.tabViewLayout = object.nativeViewProtected.tabLayout;
                    object._badges = {};
                    this.tabView = object;
                    // const nativeTabView = object._tabLayout.getChildAt(0);
                    //this.setMainTabView({ tabView: object, nativeTabView: nativeTabView });
                    /*for (let i = 0; i < nativeTabView.getChildCount(); i++) {
                        // this.addBadges(object, i, nativeTabView.getChildAt(i), object.items[i].bageValue);
                    }*/
                }
                //LIBS.sentLocalNotification({})
                /*let i = 1;
                setInterval(() => {
                    this.setBadgeNumber(1, (++i));
                }, 3000);*/
            },
            setBadgeNumber: function (tabId, number) {
                const nativeTabView = this.tabView._tabLayout.getChildAt(0);
                const view = nativeTabView.getChildAt(tabId);
                // number += this.tabView._badges[tabId] || 0;
                if (number > 0) {
                    const contentView = new ContentView();
                    contentView.className = "tab-badge";

                    const label = new Label();
                    label.className = "tab-badge-text";
                    label.text = number > 9 ? '9+' : number;
                    contentView.content = label;
                    contentView._inheritStyleScope(this.tabView._styleScope);
                    contentView._setupUI(this.tabView._context);
                    contentView.onLoaded();
                    view.addView(contentView.nativeView);
                    this.removeBadges(this.tabView, tabId, view);

                    this.tabView._badges[tabId] = contentView;
                }
                view.setOrientation(android.widget.LinearLayout.HORIZONTAL);
            },
            addBadges: function(tabView, tabIndex, view, count) {
                if (count && count > 0) {
                    const contentView = new ContentView();
                    contentView.className = "tab-badge";

                    const label = new Label();
                    label.className = "tab-badge-text";
                    label.text = count > 9 ? '9+' : count;

                    contentView.content = label;
                    contentView._inheritStyleScope(tabView._styleScope);
                    contentView._setupUI(tabView._context);
                    contentView.onLoaded();

                    view.addView(contentView.nativeView);
                    tabView._badges[tabIndex] = contentView;
                }
                view.setOrientation(android.widget.LinearLayout.HORIZONTAL);
            },
            onTabViewUnloaded: function ({object}) {
                const tabView = object;
                if (platform.isAndroid) {
                    const nativeTabView = tabView._tabLayout.getChildAt(0);
                    for (let i = 0; i < nativeTabView.getChildCount(); i++) {
                        this.removeBadges(tabView, i, nativeTabView.getChildAt(i));
                    }
                    tabView._badges = null;
                }
            },
            removeBadges: function (tabView, tabIndex, view) {
                const contentView = tabView._badges[tabIndex];
                if (contentView) {
                    contentView.content = null;
                    view.removeView(contentView.nativeView);
                    contentView.onUnloaded();
                }
            },
            initFirebase: function () {
                messaging.getCurrentPushToken().then(token => {
                    console.log('GOT CURRENT PUSH TOKEN');
                    API.updatePushToken({
                        pushToken: token,
                        uuid: platform.device.uuid,
                    }).then(res => {
                        console.log(res.data);
                    }).catch(err => {
                        console.log('ERROR UPDATING PUSH TOKEN', err);
                    })
                });
                messaging.registerForPushNotifications({
                    onPushTokenReceivedCallback: (token) => {
                        console.log("Firebase push token: " + token);
                    },

                    onMessageReceivedCallback: (message) => {
                        console.log("Push message received: " + JSON.stringify(message));
                        if (message.title && message.body) {
                            LIBS.sentLocalNotification(message);
                        }
                    },

                    // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
                    showNotifications: true,

                    // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
                    showNotificationsWhenInForeground: true
                }).then(() => console.log("Registered for push")).catch(err => {
                    console.log("Cannot register for push ", err)
                });
            },
            OnNavigatedTo: function ({object, isBackNavigation}) {
                this.handlePusher();
                this.initFirebase();
                // const myConnectionType = connectivityModule.getConnectionType();
                try {
                    connectivityModule.startMonitoring((newConnectionType) => {
                        switch (newConnectionType) {
                            case connectivityModule.connectionType.none:
                                console.log("Connection type changed to none.");
                                this.setNetWorkStatus(false);
                                break;
                            case connectivityModule.connectionType.wifi:
                                console.log("Connection type changed to WiFi.");
                                this.setNetWorkStatus(true);
                                break;
                            case connectivityModule.connectionType.mobile:
                                console.log("Connection type changed to mobile.");
                                this.setNetWorkStatus(true);
                                break;
                            default:
                                break;
                        }
                    });
                } catch (e) {
                    console.log('CONNECTION MONITORING ERROR: ', e);
                }
                // Explicitly stopping the monitoring
                // connectivityModule.stopMonitoring();
            },
            OnUnloaded: function ({object}) {
                console.log('STOP CONNECTIVITY MONITORING.');
                connectivityModule.stopMonitoring();
            },
            handlePusher: function () {
                // this.setPusherChannel('selammobile-' + platform.device.uuid + '-' + platform.device.os.toLowerCase() + '-' + platform.device.region.split(' ').join("").toLowerCase());
                this.setPusherChannel('selam-' + this.me.email);
                try {
                    console.log('INITILISE PUSHER INSTANCE');
                    const pusher = new Pusher('596c2994bf87c324b33c', {
                        authEndpoint: API.getAPIBaseURL() + '/pusher/auth',
                        cluster: 'eu',
                        forceTLS: true,
                        autoReconnect: true,
                    });
                    pusher.connect(() => {
                        console.log('PUSHER CONNECTED!!: ', this.getPusherChannel);
                    });

                    pusher.subscribeToChannelEvent(this.getPusherChannel, 'message', (error, data) => {
                        this.receivedMessage(data.data);
                        if (!this.unreadMessages[data.data.conversation])
                            this.unreadMessages[data.data.conversation] = 0;
                        this.unreadMessages[data.data.conversation] += 1;
                        this.setBadgeNumber(0, this.countUnreadConversations);
                        this.updateConversationUnreadCount({ id:  data.data.conversation, count: 1});
                    });
                    pusher.subscribeToChannelEvent(this.getPusherChannel, 'typing', (error, data) => {
                        this.receivedTypingEvent(data.data);
                    });
                    /*pusher.subscribePresence('presence-selammoibile', (data) => {
                        alert('PRESENCE: ' + JSON.stringify(data));
                    });*/
                    this.setPusherInstance(pusher);
                } catch (e) {
                    console.log('PUSHER ERROR ', e)
                }
            },
        },
        components: {
            ChatListPage,
            ArticlesListPage,
            SettingsPage,
            LoginPage
        },
        mounted: function () {
            app.on(app.launchEvent, (args) => {
            });
        },
    };
</script>

<style lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }

    .info {
        font-size: 20;
    }
    TabViewItem Image{
        width: 20;
        display: none;
    }
    TabViewItem {
        visibility: collapsed;
    }
</style>
