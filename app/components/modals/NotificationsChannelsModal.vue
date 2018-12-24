<template>
    <Frame>
    <Page  verticalAlignment="top"  @navigatedTo="onNavigatedTo">
        <ActionBar class="action-bar" title="Options de notifications">
            <NavigationButton @tap="$modal.close(false)" android.systemIcon="ic_menu_back" />
            <ActionItem @tap="$modal.close(formattedCategories)"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_save" android.position="actionBar"/>
        </ActionBar>

        <ScrollView orientation="horizontal">
            <StackLayout orientation="vertical" width="100%">
                <SegmentedBar selectedBackgroundColor="#ec4980" v-model="selectedFiltersTab">
                    <SegmentedBarItem title="Catégories" />
                </SegmentedBar>

                <GridLayout class="m-4 p-8" colomns="*" rows="auto,*,*,*" width="100%" orientation="horizontal"  v-show="selectedFiltersTab === 0">

                    <ListView for="item in formattedCategories" row="0" height="100%">
                        <v-template>
                            <FlexboxLayout flexDirection="columns" :key="item && item._id">
                                <Label :text="item.name" class="p-10 option-label" flexGrow="5"/>

                                <Switch v-model="item.selected" flexGrow="1" @checkedChange="handleSelectChange($event, item)" color="#ec4980"/>
                            </FlexboxLayout>
                        </v-template>
                    </ListView>
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </Page>
    </Frame>
</template>

<script>
    import API from '../../api'
    import Vuex from 'vuex';

    export default {
        name: "notifications-channels-modal",
        props: {
            selected: {
                type: Array,
                default: []
            }
        },
        data: function () {
            return {
                selectedFiltersTab: 0
            }
        },
        watch: {
        },
        computed: {
            ...Vuex.mapGetters(['getCategories']),
            formattedCategories: function () {
                const res = [];
                this.getCategories.map(c => {
                    res.push({ _id: c._id, name: c.name, selected: this.selected.indexOf(c._id) !== -1 });
                });
                return res;
            }
        },
        methods: {
            ...Vuex.mapActions([]),
            onNavigatedTo: function () {
            },
            handleSelectChange: function (e, item) {
            }
        }
    }
</script>

<style scoped>
    .line {
        border-bottom-width: 1;
    }
    .option-label {
        font-size: 14;
        font-weight: bold;
    }
    SegmentedBarItem {
        font-size: 18;
        font-weight: bold;
    }
</style>
