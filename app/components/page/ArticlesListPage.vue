<template>
    <Page verticalAlignment="top">
        <ActionBar class="action-bar" color="#ffffff">
            <!--<NavigationButton tap="onBackButtonTap" android.systemIcon="ic_menu_back" />-->
            <Label class="action-bar-title" text="Title"></Label>
        </ActionBar>
        <GridLayout class="m-5 p-0" rows="auto,auto,*" columns="*">
            <SearchBar @loaded="onSearchBoxLoaded" row="0"
                       id="articleSearchBar"
                       hint="Rechercher ..."
                       class="m-b-5"
                       height="auto" :text="searchPhrase"
                       @textChange="onSubmit"
                       @submit="onSubmit" />
            <GridLayout columns="*,auto,auto,auto" rows="auto" height="auto" row="1" class="m-b-5">
                <Label class="results-count" col="0" row="0">200 résultats</Label>
                <Label class="date-filter" col="1" row="0">Date Filter</Label>
                <Image v-if="false" @tap="refreshList()" class="grid filter" col="2" row="0" :src="viewMode === 'grid' ? 'res://filter_grid_primary' : 'res://filter_grid_black'" ></Image>
                <Image v-if="false" @tap="refreshList()" class="grid filter" col="3" row="0" :src="viewMode === 'list' ? 'res://filter_list_primary' : 'res://filter_list_black'" ></Image>
            </GridLayout>

            <ScrollView orientation="vertical" height="100%" row="2">
                <RadListView ref="gridView"
                    itemHeight="150"
                    layout="grid"
                    itemWidth="40%"
                    for="(item, index) in data"
                    :gridSpanCount="isTablet ? 3 : 1"
                    :selectionBehavior="'None'"
                    pullToRefresh="true"
                    @pullToRefreshInitiated="onPullToRefreshInitiated"
                >
                    <v-template>
                        <article-grid-view :data="data" :index="index" width="99%"></article-grid-view>
                    </v-template>
                </RadListView>
            </ScrollView>
            <fab
                row="2"
                @tap="showCreateModal"
                icon="res://icon_add_white"
                rippleColor="#f1f1f1"
                class="fab-button"
            ></fab>
        </GridLayout>
    </Page>
</template>

<script>
    import ArticleGridView from '../partials/ArticlesGridView';
    import ArticleListView from '../partials/ArticlesListView';
    import * as platform from 'tns-core-modules/platform'
    import AddArticleModal from '../modals/AddArticleModal'
    export default {
        name: "articles-list-page",
        data: function () {
            return {
                searchPhrase: '',
                viewMode: 'grid',
                data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
            }
        },
        watch: {
            viewMode: function (n) {
                this.refreshList();
            }
        },
        computed: {
            isTablet: function () {
                return platform.device.deviceType.toLowerCase() === 'tablet';
            }
        },
        methods: {
            onSearchBoxLoaded: function (args) {
                const page = args.object;
                const searchbarElement = page.getViewById("articleSearchBar");
                searchbarElement.android && searchbarElement.android.clearFocus();
            },
            refreshList: function () {
                if(this.$refs.gridView) {
                    this.$refs.gridView.refresh();
                }
                this.viewMode = this.viewMode === 'grid' ?  'list' : 'grid';
            },
            onPullToRefreshInitiated: function ({object}) {
                console.log('Pulling...');
                object.notifyPullToRefreshFinished();
            },
            templateSelector: function (item, index, items) {
                return this.viewMode;
            },
            showCreateModal: function () {
                this.$showModal(AddArticleModal, {
                    fullscreen: true,
                    animated: true,
                    /*transition: {
                        name: "slide",
                        duration: 150,
                        curve: "easeIn"
                    },*/
                })
            }
        },
        components: {
            ArticleGridView,
            ArticleListView,
            AddArticleModal
        }
    }
</script>

<style scoped lang="scss">
    @import '../../app-variables';

    .results-count {
        font-size: 12;
    }
    Image.filter {
        margin-right: 10;
        margin-left: 10;
    }
    .fab-button {
        height: 60;
        width: 60; /// this is required on iOS - Android does not require width so you might need to adjust styles
        margin: 15;
        background-color: #ff4081;
        horizontal-align: right;
        vertical-align: bottom;
        margin-top: 9%;
    }
</style>