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
    import { AD_SIZE, createBanner, hideBanner } from "nativescript-admob";
    const connectivityModule = require("tns-core-modules/connectivity");
    import * as platform from 'tns-core-modules/platform';
    import {Pusher} from 'nativescript-pusher';
    import Vuex from 'vuex';
    import ChatListPage from './page/ChatList';
    import ArticlesListPage from './page/ArticlesListPage';
    import SettingsPage from './page/SettingsPage';
    import {isAndroid, isIOS} from 'platform';
    import {ContentView} from 'ui/content-view';
    import {Label} from 'ui/label';
    import API from '../api';

    export default {
        name: 'app',
        data: function () {
            return {
                selectedIndex: 0,
                uuid: null,
                pusherConnected: false,
                tabViewLayout: null
            }
        },
        computed: {
            ...Vuex.mapGetters(['getPusherInstance', 'getPusherChannel', 'getNetWorkStatus']),
            getToken: function () {
                return localStorage.getItem('token');
            }
        },
        methods: {
            ...Vuex.mapActions(['setPusherInstance', 'setPusherChannel', 'setNetWorkStatus', 'receivedMessage', 'receivedTypingEvent']),
            tabChanged: function (index) {
                this.selectedIndex = index.value;
            },
            onLoaded: function () {
                this.createAddBanner();
                this.uuid = platform.device.uuid;
            },
            handleOpenedChat: function () {
                if (this.tabViewLayout) {
                    setTimeout(() => {
                        console.log(this.tabViewLayout);
                        this.tabViewLayout.getLayoutParams().height = 0;
                        this.tabViewLayout.requestLayout();
                    },100)
                }
            },
            handleClosedChat: function () {
                if (this.tabViewLayout) {
                    this.tabViewLayout.getLayoutParams().height = 145;
                    this.tabViewLayout.requestLayout();
                }
            },
            onTabViewLoaded: function ({object}) {
                if (isAndroid) {
                    this.tabViewLayout = object.nativeViewProtected.tabLayout;
                    object._badges = {};
                    const nativeTabView = object._tabLayout.getChildAt(0);
                    for (let i = 0; i < nativeTabView.getChildCount(); i++) {
                        this.addBadges(object, i, nativeTabView.getChildAt(i), object.items[i].bageValue);
                    }
                }
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
                if (isAndroid) {
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
            OnNavigatedTo: function ({object, isBackNavigation}) {
                this.handlePusher();
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
            createAddBanner: function () {
                const testing = true;
                createBanner({
                    // if this 'view' property is not set, the banner is overlayed on the current top most view
                    // view: ..,
                    size: AD_SIZE.SMART_BANNER,
                    //iosBannerId: "ca-app-pub-9517346003011652/3985369721",
                    androidBannerId: testing
                        ? "ca-app-pub-4088662990526474/4824724185"  // global test banner id
                        : "ca-app-pub-4088662990526474/4824724185", // our registered banner id
                    // Android automatically adds the connected device as test device with testing:true, iOS does not
                    // iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
                    margins: {
                        // if both are set, top wins
                        // top: 10
                        bottom: isIOS ? 50 : 0
                    },
                    keywords: ["foo", "bar"]
                }).then((res) => console.log('Banner created ', res),
                    error => console.log("Error creating banner: " , error)
                )
            },
            handlePusher: function () {
                this.setPusherChannel('selammobile-' + platform.device.uuid + '-' + platform.device.os.toLowerCase() + '-' + platform.device.region.split(' ').join("").toLowerCase());
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
            SettingsPage
        },
        mounted: function () {
            app.on(app.launchEvent, (args) => {
            });
        },
        created: function () {
            app.on(app.exitEvent, (args) => {
                console.log('GOOD BUY DUDE FROM: ' + app.exitEvent);
                //this.getPusherInstance && this.getPusherInstance.unsubscribeAll();
            })
        },
        beforeDestroy: function () { }
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
