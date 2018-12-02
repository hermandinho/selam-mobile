<template>
    <Page>
        <ActionBar class="action-bar" color="#ffffff">
            <!--<NavigationButton tap="onBackButtonTap" android.systemIcon="ic_menu_back" />-->
            <Label class="action-bar-title" text="Discutions"></Label>

            <ActionItem v-show="selectedItems.length > 0" tap="onShare"
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
                             for="item in listItems"
                             layout="linear"
                             separatorColor="#f0f0f0"
                             :multipleSelection="true"
                             :selectionBehavior="selectedItems.length ? 'Press' : 'LongPress'"
                             @itemSelected="onItemSelected"
                             @itemDeselected="onItemDeselected"
                             pullToRefresh="true"
                             swipeActions="false"
                             @pullToRefreshInitiated="onPullToRefreshInitiated"
                             @itemSwipeProgressStarted="onSwipeStarted"
                             @itemTap="onItemTap">
                    <v-template>
                        <FlexboxLayout :class="getItemClass(item)" class="p-4" flexDirection="vertical" height="100" horizontalAlignment="left" verticalAlignment="center">
                            <Image src="~/assets/images/avatar.png" stretch="aspectFit" class="img-rounded img-thumbnail" width="50"/>
                            <FlexboxLayout flexDirection="column">
                                <Label class="p-10 user-name" marginTop="2">El Manifico</Label>
                                <Label class="p-10 message-preview" :textWrap="false" width="80%">Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</Label>
                            </FlexboxLayout>
                        </FlexboxLayout>
                    </v-template>

                    <v-template name="itemswipe" v-if="false">
                        <GridLayout columns="auto, *, auto" backgroundColor="White">
                            <StackLayout id="mark-view" col="0" class="swipe-item left"
                                         orientation="horizontal" @tap="onLeftSwipeClick">
                                <Label text="mark" verticalAlignment="center" horizontalAlignment="center"/>
                            </StackLayout>
                            <StackLayout id="delete-view" col="2" class="swipe-item right"
                                         orientation="horizontal" @tap="onRightSwipeClick">
                                <Label text="delete" verticalAlignment="center" horizontalAlignment="center" />
                            </StackLayout>
                        </GridLayout>
                    </v-template>
                </RadListView>
            </ScrollView>
        </FlexboxLayout>
    </Page>

</template>

<script>
    import ChatPage from './ChatPage'
    export default {
        name: 'chat',
        data: function () {
          return {
              searchPhrase: '',
              listItems: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
              selectedItems: [],
          }
        },
        computed: {
        },
        methods: {
            onSubmit: function (e) {
                console.log(e);
            },
            openChat: function ({ index, object }) {
              this.$navigateTo(ChatPage, {
                  animated: true,
                  transition: {
                      name: "slide",
                      duration: 150,
                      curve: "easeIn"
                  },
                  props: {
                      user: { name: 'El Manifico' },
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
            onItemTap: function ({ index, object }) {
                if (this.selectedItems.length) {
                    return false;
                }
                this.openChat({ index, object });
            },
            onLoaded: function (args) {
                const page = args.object;
                const searchbarElement = page.getViewById("searchBar");
                searchbarElement.android && searchbarElement.android.clearFocus();
            },
            onPullToRefreshInitiated: function ({object}) {
                console.log('Pulling...');
                setTimeout(() => {
                    this.listItems.push(Math.random() * 1000);
                    object.notifyPullToRefreshFinished();
                }, 5000)
            },
            onSwipeStarted ({ data, object }) {
                console.log(`Swipe started`);
                const swipeLimits = data.swipeLimits;
                const swipeView = object;
                const leftItem = swipeView.getViewById('mark-view');
                const rightItem = swipeView.getViewById('delete-view');
                swipeLimits.left = leftItem.getMeasuredWidth();
                swipeLimits.right = rightItem.getMeasuredWidth();
                swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
            },
            onLeftSwipeClick (event) {
                console.log('left action tapped');
                this.$refs.listView.notifySwipeToExecuteFinished();
            },
            onRightSwipeClick ({ object }) {
                console.log('right action tapped');
                // remove item
                this.listItems.splice(this.listItems.indexOf(object.bindingContext), 1);
                this.$refs.listView.notifySwipeToExecuteFinished();
            },
        },
        components: {
            ChatPage
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
</style>
