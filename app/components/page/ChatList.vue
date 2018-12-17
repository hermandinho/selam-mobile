<template>
    <Page @navigatedTo="onNavigatedTo">
        <ActionBar class="action-bar" color="#ffffff">
            <!--<NavigationButton tap="onBackButtonTap" android.systemIcon="ic_menu_back" />-->
            <Label class="action-bar-title" text="Discutions"></Label>

            <ActionItem v-show="selectedItems.length > 0" @tap="deleteConversations"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_delete" android.position="actionBar"/>

            <ActionItem v-show="selectedItems.length > 0 && false" @tap="deselectAllItems"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
        </ActionBar>

        <FlexboxLayout class="m-4 p-0" flexDirection="column">

            <SearchBar @loaded="onLoaded"
                       id="searchBar"
                       hint="Rechercher ..."
                       height="120" :text="searchPhrase"
                       @textChange="onSubmit"
                       @submit="onSubmit" />

            <ScrollView orientation="vertical" height="100%">

                <RadListView ref="listView"
                             for="(item, index) in data"
                             layout="linear"
                             :multipleSelection="true"
                             :selectionBehavior="selectedItems.length ? 'Press' : 'LongPress'"
                             @itemSelected="onItemSelected"
                             @itemDeselected="onItemDeselected"
                             pullToRefresh="true"
                             @pullToRefreshInitiated="onPullToRefreshInitiated"
                             @loadMoreDataRequested="loadMore"
                             loadOnDemandBufferSize="5"
                             :loadOnDemandMode="hasMoreItems ? 'Auto' : 'None'"
                             @itemTap="openChat">
                    <v-template name="full" if="item._id !== 'empty'">
                        <FlexboxLayout :key="index" :class="getItemClass(item)" class="p-4" flexDirection="vertical" height="100" horizontalAlignment="left" verticalAlignment="center">
                            <Image :src="getOtherUser(item) && getOtherUser(item).picture || 'res://ic_no_image'" stretch="aspectFit" class="img-rounded img-thumbnail" width="50"/>
                            <FlexboxLayout flexDirection="column">
                                <FlexboxLayout flexDirection="row" justifyContent="space-between">
                                    <Label class="p-10 user-name" marginTop="2">{{ getOtherUser(item) && getOtherUser(item).name || 'N/A' }}</Label>
                                    <Label class="p-10 msg-date m-r-12" marginTop="2">
                                        <FormattedString>
                                            <Span :text="item.lastMessage && item.lastMessage.sent_at | toDate" />
                                            <Span text="" class="badge" />
                                        </FormattedString>
                                    </Label>
                                </FlexboxLayout>
                                <Label class="p-10 message-preview"
                                       :textWrap="false" width="92%" opacity="0.6">{{ item.lastMessage && item.lastMessage.content || '' }}</Label>
                            </FlexboxLayout>
                        </FlexboxLayout>
                    </v-template>
                    <v-template name="empty" if="item._id === 'empty'">
                        <FlexboxLayout class="empty-list-container" flexDirection="column" justifyContent="center"
                                       alignItems="center" alignContent="center">
                            <Label alignSelf="center" class="empty-list-text">Liste vide pour l'instant</Label>
                        </FlexboxLayout>
                    </v-template>
                </RadListView>
            </ScrollView>
        </FlexboxLayout>
    </Page>

</template>

<script>
    import Vuex from 'vuex';
    import ChatPage from './ChatPage';
    import ChatPageModal from '../modals/ChatPageModal'
    import API from '../../api';

    export default {
        name: 'chat',
        data: function () {
            return {
                searchPhrase: '',
                data: [],
                selectedItems: [],
                maxPages: 0,
                totalPages: 0,
                page: 1,
                loading: false,
                hasMoreItems: true,
            }
        },
        computed: {
            ...Vuex.mapGetters(['getChatUsers', 'getTypers']),
            me: function () {
                const user = localStorage.getItem('user');
                if (!user) return null;
                return JSON.parse(user);
            }
        },
        methods: {
            ...Vuex.mapActions(['fetchedChatUsers', 'setCurrentConversationId', 'deletedConversations']),
            onNavigatedTo: function ({isBackNavigation}) {
                if (isBackNavigation) {
                    this.$emit('closedChat');
                    this.setCurrentConversationId(null);
                    return;
                }
                this.fetchData({}).then(res => {}).catch(err => {});
            },
            getOtherUser: function (item) {
                if (!item) return;
                if (item.sender._id !== this.me._id) {
                    return item.sender;
                } else {
                    return item.receiver
                }
            },
            fetchData: function (params) {
                this.loading = !params.loadingMore && !params.refresh;
                return API.fetchConversations({page: this.page}).then(res => {
                    const docs = res.data.docs || [];
                    this.maxPages = res.data.pages;
                    this.totalData = res.data.total;

                    this.hasMoreItems = docs.length >= res.data.limit;
                    if (params.loadingMore) {
                        this.data = this.data.concat(docs);
                    } else {
                        this.data = docs;
                    }
                    if (docs.length && this.page <= this.maxPages)
                        this.page ++;
                    if (this.data.length === 0) {
                        this.data.push({ _id: 'empty' });
                    }
                    return Promise.resolve(res.data);
                }).catch(err => {
                    return Promise.reject(err);
                });
            },
            onSubmit: function (e) {},
            openChat: function ({ index, object, item }) {
                this.$emit('openedChat');
                if (this.selectedItems.length) return;
                this.$navigateTo(ChatPage, {
                    animated: true,
                    frame: 'chatFrame',
                    /*transition: {
                        name: "slide",
                        duration: 120,
                        curve: "easeIn"
                    },*/
                    props: {
                        user: this.getOtherUser(item) || null
                    }
                });
            },
            onItemSelected: function ({ index, object }) {
                //const itemSelected = this.listItems[index]
                //console.log(`Item selected: ${itemSelected}`);
                this.setSelectedItems();
            },
            onItemDeselected: function ({ index, object }) {
                //const itemSelected = this.listItems[index]
                //console.log(`Item deselected ${itemSelected}`);
                this.setSelectedItems();
            },
            setSelectedItems() {
                this.isSelected = !this.isSelected;
                this.selectedItems = this.$refs.listView.getSelectedItems();
                //this.$refs.listView.refresh(); // refresh will recalculate items' CSS classes
            },
            deselectAllItems: function () {
                // this.$refs.listView.scrollToIndex(20, true);
                this.$refs.listView.selectAll();
                console.log(this.$refs.listView);
            },
            getItemClass(item) {
                return this.selectedItems.indexOf(item) >= 0 ? 'selected' : ''
            },
            onLoaded: function (args) {
                const page = args.object;
                const searchbarElement = page.getViewById("searchBar");
                searchbarElement.android && searchbarElement.android.clearFocus();
            },
            onPullToRefreshInitiated: function ({object}) {
                console.log('Pulling...');
                this.page = 1;
                this.data = [];
                this.fetchData({refresh: true }).then(res => {
                    object.notifyPullToRefreshFinished();
                }).catch(err => {
                    object.notifyPullToRefreshFinished();
                });
            },
            loadMore: function ({ object }) {
                console.log('Loading More ....');
                this.fetchData({loadingMore: true}).then(res => {
                    object.notifyLoadOnDemandFinished(!this.hasMoreItems);
                }).catch(err => {
                    console.log('LOADED MORE ERROR');
                    object.notifyLoadOnDemandFinished(!this.hasMoreItems);
                });
            },
            deleteConversations: function () {
                const ids = [];
                this.selectedItems.map(i => {
                    ids.push(i._id);
                });
                API.deleteConversations(ids).then(res => {
                    this.data = this.data.filter(u => ids.indexOf(u._id) === -1);
                    setTimeout((res) => {
                        this.setSelectedItems();
                        this.$refs.listView.refresh();
                    }, 100)
                })
            }
        },
        components: {
            ChatPage,
            ChatPageModal
        }
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }

    .info {
        font-size: 20;
    }
    .user-name {
        font-weight: bold;
    }
    .message-preview {
        font-size: 12;
    }

    .selected {

    }
    .item-row {
        border-bottom: 5px solid red;
    }

    .msg-date {
        font-size: 10;
        font-style: italic;
    }

    .badge {
        color: #ec4980;
        font-size: 12;
    }
    .empty-list-text {
        color: #000;
        font-weight: bold;
        font-size: 25;
        opacity: .3;
    }
</style>
