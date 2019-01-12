<template>
    <Page verticalAlignment="top" @navigatedTo="onNavigatedTo" class="chatPage">
        <ActionBar class="action-bar" color="#ffffff">
            <NavigationButton @tap="onBackButtonTap" android.systemIcon="ic_menu_back"></NavigationButton>
            <Label class="action-bar-title" :text="user.name"></Label>
            <ActionItem v-show="selectedMessages.length > 0" tap="onShare"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_delete" android.position="actionBar"/>
        </ActionBar>

        <GridLayout class="main-grid" columns="*" rows="*,auto">
            <ActivityIndicator row="0" :busy="loading" rowSpan="1" colSpan="0" color="#ec4980" />
            <ScrollView v-show="!loading" row="0" column="1" orientation="vertical" height="95%" class="p-0">
                <RadListView ref="messagesListView"
                     for="(item, index) in getCurrentChatMessages"
                     class="chatBox"
                     :selectionBehavior="selectedMessages.length ? 'Press' : 'LongPress'"
                     :multipleSelection="true"
                     @itemSelected="onItemSelected"
                     @itemDeselected="onItemDeselected"
                     style="margin-bottom: 3">
                    <v-template>
                        <GridLayout :key="item._id + '_' + index" :class="getItemClass(item)" :columns="isIncommingMessage(item) ? '3*,*' : '*,3*'" rows="auto,auto" width="100%">
                            <!--imcoming message Image-->
                            <!--<Image row="0" col="0" src="item.incomingMessageDP" class="avatar" stretch="aspectFit" opacity="1"></Image>-->
                            <StackLayout row="0" :col="isIncommingMessage(item) ? 0 : 1" class="chat">
                                <Label width="auto" :key="'msg' + item._id"
                                       textWrap="true"
                                       class="bubble message-item"
                                       :class="isIncommingMessage(item) ? 'incomingMessage' : 'outgoingMessage'"
                                       :horizontalAlignment="isIncommingMessage(item) ? 'left' : 'right'"
                                >{{ item.content }}</Label>
                            </StackLayout>
                            <StackLayout row="1" :col="isIncommingMessage(item) ? 0 : 1">
                                <Label row="1" column="1" :text="item.sent_at | toDate(true)" class="dateTime" marginTop="1"
                                       :horizontalAlignment="isIncommingMessage(item) ? 'left' : 'right'"> </Label>
                            </StackLayout>
                        </GridLayout>
                    </v-template>
                </RadListView>
            </ScrollView>

            <GridLayout row="1"
                column="0"
                columns="4*,*"
                rows="auto,*"
                width="100%"
                backgroundColor="#EC4980"
                verticalalignment="bottom"
                horizontalAlignment="center"
                class="p-10 m-b-0 message-grid">

                <Label row="0" col="0" class="typing-hint p-5 m-r-5" v-if="getTypers.length && getTypers.indexOf(user._id) !== -1 ">écrit ...</Label>

                <TextView autocorrect="true" editable="true"
                       row="1" col="0"
                       class="msg-field p-5"
                       v-model="message"
                       color="white"
                       borderwidth="5"
                       @textChange="handleTypingEvent"
                       style="color: black; padding: 10"
                       returnKeyType="done"
                       hint="Votre message ..." />

                <GridLayout columns="*,*" rows="*" row="1" col="1" verticalalignment="center">
                    <Image row="0" col="1" src="res://send_white" width="30" @tap="sendMessage" horizontalAlignment="center"  />
                </GridLayout>

            </GridLayout>

        </GridLayout>
    </Page>
</template>

<script>
    import Vuex from 'vuex';
    const Toast = require('nativescript-toast');
    import API from '../../api';

    export default {
        props: {
            user: {
                type: Object,
                default: () => {
                    return {name: 'System', id: -1}
                },
                required: true
            },
            text: {
                type: String,
                default: ''
            },
            fromFrame: {
                type: String,
                default: 'chatFrame'
            },
            isModal: {
                type: Boolean,
                default: false
            }
        },
        name: "chat-page",
        data: function () {
            return {
                message: '',
                selectedMessages: [],
                typing: false,
                timeout: undefined,
                loading: true
            }
        },
        watch: {
            getCurrentChatMessages: function (n) {
                this.$refs.messagesListView.scrollToIndex(n.length, true, 'End');
            }
        },
        computed: {
            ...Vuex.mapGetters([
                'getCurrentChatMessages', 'getCurrentConversationId', 'getTypers'
            ]),
            me: function () {
                const user = localStorage.getItem('user');
                if (!user) return;
                return JSON.parse(localStorage.getItem('user'));
            }
        },
        methods: {
            ...Vuex.mapActions([
                'setCurrentConversationId', 'fetchedConversationMessages', 'receivedMessage',
            ]),
            onBackButtonTap: function ({object, view}) {
                if (this.isModal) {
                    this.$modal.close();
                } else {
                    this.$navigateBack(/*{ frame: 'chatFrame',  }*/);
                }
            },
            fetchChat: function () {
                if (!this.user || !this.user._id) return;
                if (this.getCurrentChatMessages.length) {
                    return this.getCurrentChatMessages;
                }
                this.loading = true;
                API.fetchMessages(this.user._id).then(res => {
                    this.fetchedConversationMessages(res.data);
                    if (res.data && res.data[0]) {
                        this.setCurrentConversationId(res.data[0].conversation);
                    }
                    if (!res.data.length) {
                        if (this.text) {
                            this.message = this.text;
                        }
                    }
                    this.loading = false;
                }).catch(err => {
                    alert('Impossible de charger cette discussion.').then(res => {
                        this.$navigateBack();
                    })
                    this.loading = false;

                })
            },
            onNavigatedTo: function ({object}) {
                this.fetchChat();
            },
            sendMessage: function () {
                const params = { content: this.message.trim() };
                if (!params.content.length) {
                    Toast.makeText("Impossible d'envoyer des messages vide :)", 'short').show();
                    return;
                }
                this.message = '';
                API.sendMessage(this.user._id, params).then(res => {
                    if (res.data) {
                        this.setCurrentConversationId(res.data.conversation);
                    }
                    this.receivedMessage(res.data);
                }).catch(err => {
                    console.log(err);
                })
            },
            isIncommingMessage: function (msg) {
                return msg.trigger === this.user._id;
            },
            onItemSelected: function ({ index, object }) {
                const itemSelected = this.selectedMessages[index]
                console.log(`Item selected ${itemSelected}`);
                this.setSelectedItems();
            },
            onItemDeselected: function ({ index, object }) {
                const itemSelected = this.selectedMessages[index]
                console.log(`Item deselected ${itemSelected}`);
                this.setSelectedItems();
            },
            setSelectedItems() {
                //this.isSelected = !this.isSelected;
                //this.selectedMessages = JSON.parse(JSON.stringify(this.$refs.messagesListView.getSelectedItems()));
                //this.$refs.messagesListView.refresh(); // refresh will recalculate items' CSS classes
                let items = this.$refs.messagesListView.getSelectedItems();
                // this.selectedMessages = items;
                // REQUIRE HERE FOR HACK
                const Toast = require('nativescript-toast');
                Toast.makeText(JSON.stringify( this.$refs.messagesListView.getSelectedItems()), 'medium').show();
            },
            getItemClass(item) {
                return this.selectedMessages.indexOf(item) >= 0 ? '_selected' : ''
            },
            emitStopTypingEvent: function () {
                this.typing = false;
                API.sendTypingEvent(this.getCurrentConversationId, false, this.user._id);
            },
            emitTypingEvent: function () {
                API.sendTypingEvent(this.getCurrentConversationId, true, this.user._id);
            },
            handleTypingEvent: function () {
                if (!this.typing) {
                    this.typing = true;
                    this.emitTypingEvent(true);
                    this.timeout = setTimeout(this.emitStopTypingEvent, 2000);
                } else {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(this.emitStopTypingEvent, 2000);
                }
            }
        }
    }
</script>

<style scoped>
    Page {
        padding: 0;
        margin: 0;
    }
    .msg-field {
        border: 1px solid blue;
        color: black;
        /*margin-top: 5;*/
        font-size: 13;
    }
    .typing-hint {
        font-size: 10;
        font-style: italic;
    }
    .chatBox{
        margin-top: 5;
        margin-bottom: 20;
        background-color: transparent;
        opacity: 1;
        separator-color: transparent;
    }
    .chat {
        width: auto;
        height: auto;
        background-color: transparent;
    }
    .incomingName {
        color:#009688;
        width: auto;
        padding: 1;
        text-align: left;
        font-size: 10;
        margin-left: 6;
        text-decoration: underline;
    }
    .outgoingName {
        color:#03A9F4;
        width: auto;
        padding: 1;
        text-align: left;
        font-size: 10;
        margin-right: 6;
        text-decoration: underline;
    }
    .incomingPhoto{
        background-color: #03A9F4;
        width: auto;
        color: white;
        padding: 1;
        text-align: left;
    }
    .outgoingPhoto {
        background-color: #009688;
        width: auto;
        color: black ;
        padding: 1;
        text-align: left;
    }
    .bubblePhoto{
        margin: 2 5 5;
        background-color: #F2F2F2;
        border-radius: 5px;
        box-shadow: 8px 8px 4px #888888;
        display: inline-block;
        padding: 2px 4px;
        position: relative;
        vertical-align: top;
    }
    .message-item {
        width: auto;
        padding: 5;
        text-align: left;
        margin: 2 5 5;
        font-size: 16;
    }
    .incomingMessage {
        background-color: #03A9F4;
        color: white;
    }
    .outgoingMessage {
        background-color: #009688;
        color: black ;
    }
    .bubble.incomingMessage {
        background-color: rgba(236, 73, 128, 0.33);
    }
    .bubble.outgoingMessage {
        background-color: #F2F2F2;
    }
    .bubble {
        /*background-color: #F2F2F2;*/
        border-radius: 5px;
        box-shadow: 8px 8px 4px #ff064f;
        display: inline-block;
        padding: 10px 18px;
        position: relative;
        vertical-align: top;
    }
    .dateTime{
        font-size: 8;
        color:#03A9F4;
        margin-bottom: 2;
        margin-top: -4;
        margin-left: 5;
        margin-right: 10;
    }
    .message-grid {
        color: white;
    }
    TextView {
        border-width: 1 1 1 1;
        border-color: #ffffff;
        border-radius: 15;
        background-color: #ffffff;
        color: #000000 !important;
    }
    .selected {
        background-color: #0F336D;
    }
</style>
