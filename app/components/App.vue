<template>
    <Page class="page" actionBarHidden="true">
        <!--<ActionBar class="action-bar" color="#ffffff">
            <Label class="action-bar-title" text="Home"></Label>
        </ActionBar>-->

        <!--<GridLayout>
            <Label class="info" horizontalAlignment="center" verticalAlignment="center">
                <FormattedString>
                    <Span class="fa" text.decode="&#xf135; "/>
                    <Span :text="message"/>
                </FormattedString>
            </Label>
        </GridLayout>-->
        <TabView
                id="main-tab"
                :selectedIndex="0"
                androidTabsPosition="bottom"
                androidSelectedTabHighlightColor="#ffffff"
                tabBackgroundColor="#ec4980"
                @selectedIndexChange="tabChanged"
                iosIconRenderingMode="alwaysOriginal"
                selectedTabTextColor="#ffffff">
            <TabViewItem title="" :iconSource="selectedIndex == 0 ? 'res://chat_white' : 'res://chat_black'">
                <!--<chat-view style=""/>-->
                <Frame>
                    <chat-list-page></chat-list-page>
                </Frame>
            </TabViewItem>
            <TabViewItem title="" :iconSource="selectedIndex == 1 ? 'res://basket_white' : 'res://basket_black'">
                <Label :text="'This is Label in Tab 2 -> ' + selectedIndex" />
            </TabViewItem>
            <TabViewItem title="" :iconSource="selectedIndex == 2 ? 'res://settings_white' : 'res://settings_black'">
                <Label :text="'This is Label in Tab 3 -> ' + selectedIndex" />
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script>
    import ChatListPage from './page/ChatList'
    export default {
        name: 'app',
        data: function () {
            return {
                selectedIndex: 0
            }
        },
        computed: {
            message() {
                return "Blank {N}-Vue app";
            }
        },
        methods: {
            tabChanged: function (index) {
                this.selectedIndex = index.value;
            }
        },
        components: {
            ChatListPage,
        }
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
