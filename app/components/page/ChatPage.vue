<template>
    <Page verticalAlignment="top" backgroundColor="reansparent" >
        <ActionBar class="action-bar" color="#ffffff">
            <NavigationButton @tap="onBackButtonTap" android.systemIcon="ic_menu_back"></NavigationButton>
            <Label class="action-bar-title" :text="user.name"></Label>
            <ActionItem v-show="selectedMessages.length > 0" tap="onShare"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_delete" android.position="actionBar"/>
        </ActionBar>

        <GridLayout class="main-grid" columns="*" rows="*,auto">
            <ScrollView row="0" column="1" orientation="vertical" height="95%" class="p-0">
                <RadListView ref="messagesListView"
                     for="(item, index) in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]"
                     class="chatBox"
                     :selectionBehavior="selectedMessages.length ? 'Press' : 'LongPress'"
                     :multipleSelection="true"
                     @itemSelected="onItemSelected"
                     @itemDeselected="onItemDeselected"
                     style="margin-bottom: 3">
                    <v-template>
                        <GridLayout :key="index" :class="getItemClass(item)" :columns="isIncommingMessage(item) ? '3*,*' : '*,3*'" rows="auto,auto" width="100%">
                            <!--imcoming message Image-->
                            <!--<Image row="0" col="0" src="item.incomingMessageDP" class="avatar" stretch="aspectFit" opacity="1"></Image>-->
                            <StackLayout row="0" :col="isIncommingMessage(item) ? 0 : 1" class="chat">
                                <Label width="auto"
                                       textWrap="true"
                                       class="bubble message-item"
                                       :class="isIncommingMessage(item) ? 'incomingMessage' : 'outgoingMessage'"
                                       :horizontalAlignment="isIncommingMessage(item) ? 'left' : 'right'"
                                >Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</Label>
                            </StackLayout>
                            <StackLayout row="1" :col="isIncommingMessage(item) ? 0 : 1">
                                <Label row="1" column="1" text="02/02/2018" class="dateTime" marginTop="1"
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

                <Label row="0" col="0" class="typing-hint p-5 m-r-5"> is typing ...  ->  {{ selectedMessages.length }}</Label>

                <TextField autocorrect="true"
                       row="1" col="0"
                       class="msg-field p-5"
                       v-model="message"
                       color="white"
                       borderwidth="5"
                       returnKeyType="done"
                       hint="Votre message" />

                <GridLayout columns="*,*" rows="*" row="1" col="1">
                    <Image  row="0" col="1" src="res://send_white" width="30" @tap="sendMessage"/>
                </GridLayout>

            </GridLayout>

        </GridLayout>
    </Page>
</template>

<script>
    export default {
        props: {
            user: {
                type: Object,
                default: () => {
                    return {name: 'System', id: -1}
                },
                required: true
            }
        },
        name: "chat-page",
        data: function () {
            return {
                message: '',
                selectedMessages: [],
            }
        },
        computed: { },
        methods: {
            onBackButtonTap: function () {
                this.$navigateBack();
            },
            isIncommingMessage: function (msg) {
                return msg % 2;
            },
            sendMessage: function (e) {
                action("Your message", "Cancel button text", ["Option1", "Option2"])
                .then(result => {
                    console.log(result);
                });
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
        margin-bottom: 5;
        margin-left: 5;
        margin-right: 5;
        margin-top: 2;
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
        margin-bottom: 5;
        margin-left: 5;
        margin-right: 5;
        margin-top: 2;
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
    TextField {
        border-width: 1 1 1 1;
        border-color: #ffffff;
        border-radius: 15;
    }
    .selected {
        background-color: #0F336D;
    }
</style>