<template>
    <Page class="page" actionBarHidden="true" @loaded="onLoaded">
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
            <TabViewItem bageValue="50" title="" :iconSource="selectedIndex == 0 ? 'res://chat_white' : 'res://chat_black'">
                <!--<chat-view style=""/>-->
                <Frame>
                    <chat-list-page></chat-list-page>
                </Frame>
            </TabViewItem>
            <TabViewItem bageValue="1" title="" :iconSource="selectedIndex == 1 ? 'res://basket_white' : 'res://basket_black'">
                <Frame>
                    <articles-list-page></articles-list-page>
                </Frame>
            </TabViewItem>
            <TabViewItem :bageValue="x" title="" :iconSource="selectedIndex == 2 ? 'res://settings_white' : 'res://settings_black'">

                <DockLayout width="210" height="210" backgroundColor="lightgray" stretchLastChild="false">
                    <Label :text="getToken" textWrap="true" dock="top" height="200" backgroundColor="green"/>
                    <Label text="Logout" dock="bottom" height="60" backgroundColor="yellow" @tap="logout" />
                </DockLayout>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script>
    import * as app from 'tns-core-modules/application'
    import * as platform from 'tns-core-modules/platform'
    import { Pusher } from 'nativescript-pusher';
    import Vuex from 'vuex';
    import ChatListPage from './page/ChatList';
    import ArticlesListPage from './page/ArticlesListPage';
    import LoginPage from './page/LoginPage'
    import { isIOS, isAndroid } from 'platform';
    import { ContentView } from 'ui/content-view';
    import { Label } from 'ui/label';

    export default {
        name: 'app',
        data: function () {
            return {
                selectedIndex: 0,
                uuid: null,
                pusherConnected: false,
            }
        },
        computed: {
            ...Vuex.mapGetters(['getTest', 'getPusherInstance', 'getPusherChannel']),
            getToken: function () {
                return localStorage.getItem('token');
            }
        },
        methods: {
            ...Vuex.mapActions(['test', 'setPusherInstance', 'setPusherChannel']),
            tabChanged: function (index) {
                this.selectedIndex = index.value;
            },
            onLoaded: function () {
                this.uuid = platform.device.uuid;
                this.setPusherChannel('selammobile-channel-' + this.uuid);
                return true;
                if (this.getPusherInstance) {
                    console.log('PUSHER ALREADY INITIALISED');
                    return;
                }
                try {
                    console.log('INITILISE PUSHER INSTANCE');
                    const pusher = new Pusher('596c2994bf87c324b33c', {
                        cluster: 'eu',
                        forceTLS: true,
                        autoReconnect: false
                    });
                    // pusher.unsubscribeAll();
                    // pusher.disconnect();
                    if (!this.pusherConnected) {
                        pusher.connect(() => {
                            this.pusherConnected = true;
                            console.log('PUSHER CONNECTED!!: ', this.getPusherChannel);
                            // pusher.disconnect();
                        });
                    }
                    pusher.subscribeToChannelEvent(this.getPusherChannel, 'debug', (error, data) => {
                        alert(JSON.stringify(data));
                    });
                    /*pusher.subscribePresence('presence-' + this.getPusherChannel, (data) => {
                        alert('PRESENCE: ' + JSON.stringify(data));
                    });*/
                    this.setPusherInstance(pusher);

                } catch (e) {
                    action("ERROR -> ", e.message);
                    console.log('ERROR ----> ', e);
                }
            },
            logout: function () {
                localStorage.clear();
                this.$navigateTo(LoginPage, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: "slide",
                        duration: 150,
                        curve: "easeOut"
                    },
                    props: {
                    }
                });
            },
            onTabViewLoaded: function ({object}) {
                if (isAndroid) {
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
            }
        },
        components: {
            ChatListPage,
            ArticlesListPage,
            LoginPage
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
</style>
