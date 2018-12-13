<template>
    <Page verticalAlignment="top" @navigatedTo="onNavigatedTo">
        <ActionBar class="action-bar" color="#ffffff">
            <!--<NavigationButton tap="onBackButtonTap" android.systemIcon="ic_menu_back" />-->
            <Label class="action-bar-title" text="Title"></Label>
        </ActionBar>
        <GridLayout class="m-5 p-0" rows="auto,auto,*" columns="*" v-if="getNetWorkStatus">
            <SearchBar @loaded="onSearchBoxLoaded" row="0"
                       id="articleSearchBar"
                       hint="Rechercher ..."
                       class="m-b-5"
                       height="auto" :text="searchPhrase"
                       @textChange="onSubmit"
                       @submit="onSubmit" />
            <GridLayout columns="*,auto,auto,auto" rows="auto" height="auto" row="1" class="m-b-5">
                <Label class="results-count" col="0" row="0">{{ data.length }} résultats</Label>
                <Image src="res://ic_marker" class="filter" col="1" row="0" stretch="aspectFit" width="30" @tap="showLocationFilterModal"/>
                <Image src="res://ic_filter" class="filter" col="2" row="0" stretch="aspectFit" width="30" @tap="showFilters"/>
                <!--<Image v-if="false" @tap="refreshList()" class="grid filter" col="2" row="0" :src="viewMode === 'grid' ? 'res://filter_grid_primary' : 'res://filter_grid_black'" ></Image>
                <Image v-if="false" @tap="refreshList()" class="grid filter" col="3" row="0" :src="viewMode === 'list' ? 'res://filter_list_primary' : 'res://filter_list_black'" ></Image>-->
            </GridLayout>

            <ActivityIndicator row="2" :busy="loading" rowSpan="3" colSpan="1" color="#ec4980" />

            <ScrollView orientation="vertical" height="100%" row="2">
                <RadListView ref="gridView"
                    layout="grid"
                    itemWidth="40%"
                    for="(item, index) in data"
                    :gridSpanCount="isTablet ? 3 : 1"
                    :selectionBehavior="'None'"
                    pullToRefresh="true"
                    @pullToRefreshInitiated="onPullToRefreshInitiated"
                    @itemTap="showDetails"
                    :loadOnDemandMode="hasMoreItems ? 'Auto' : 'None'"
                    @loadMoreDataRequested="loadMore"
                    loadOnDemandBufferSize="3"
                >
                    <v-template>
                        <article-grid-view :data="item" :index="index" width="99%"></article-grid-view>
                    </v-template>
                    <!--<v-template name="footer" v-if="page >= maxPages">
                        <Label text="Fin de la liste"></Label>
                    </v-template>-->
                </RadListView>
            </ScrollView>
            <fab
                row="2"
                @tap="showCreateModal"
                icon="res://ic_add_white"
                rippleColor="#f1f1f1"
                class="fab-button"
            ></fab>
        </GridLayout>
        <FlexboxLayout v-else flexDirection="column" justifyContent="center" height="100%" width="100%">
            <Image stretch="aspectFit" src="res://ic_no_network" class="m-t-15" width="150" height="150" opacity="0.6" horizontalAllignment="center"/>
            <Label class="no_network" text="Vérifiez votre connection Internet." horizontalAllignment="center" alignSelf="center"/>
        </FlexboxLayout>
    </Page>
</template>
<!--loadOnDemandBufferSize="3"-->
<script>
    import Vuex from 'vuex';
    import ArticleGridView from '../partials/ArticlesGridView';
    import ArticleListView from '../partials/ArticlesListView';
    import * as platform from 'tns-core-modules/platform'
    import AddArticleModal from '../modals/AddArticleModal'
    import LocationFilterModal from '../modals/LocationFilterModal'
    import Details from './ArticleDetailPage';
    import API from '../../api'

    export default {
        name: "articles-list-page",
        data: function () {
            return {
                searchPhrase: '',
                viewMode: 'grid',
                data: [/*1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18*/],
                filters: {
                    towns: [],
                    country: ''
                },
                page: 1,
                maxPages: 1,
                hasMoreItems: true,
                loading: true,
                sorts: {
                    date: { asc: false, desc: true },
                    price: { asc: false, desc: false },
                }
            }
        },
        watch: {
            viewMode: function (n) {
                this.refreshList();
            }
        },
        computed: {
            ...Vuex.mapGetters(['getNetWorkStatus']),
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
                //this.viewMode = this.viewMode === 'grid' ?  'list' : 'grid';
            },
            onPullToRefreshInitiated: function ({object}) {
                console.log('Pulling...');
                this.page = 1;
                this.data = [];
                this.fetchData({refresh: true }).then(res => {
                    console.log('PULLING OVER');
                    object.notifyPullToRefreshFinished(true);
                }).catch(err => {
                    console.log('PULLING ERROR');
                    object.notifyPullToRefreshFinished(true);
                });

            },
            showCreateModal: function () {
                this.$showModal(AddArticleModal, {
                    fullscreen: true,
                    animated: true
                })
            },
            showLocationFilterModal: function () {
                this.$showModal(LocationFilterModal, {
                    fullscreen: true,
                    animated: true,
                    props: {
                        oldTowns:  this.filters.towns,
                        country:  this.filters.country
                    }
                }).then(res => {
                    this.filters.towns = [];
                    this.filters.country = '';
                    res.selectedTowns && res.selectedTowns.map(t => {
                        this.filters.towns.push(t._id);
                    });
                    this.filters.country = res.selectedCountry || '';
                    if (this.filters.towns.length) {
                        this.page = 1;
                        this.data = [];
                        this.fetchData({}).then(res => { }).catch(err => {});
                    }
                })
            },
            showDetails: function (row) {
                this.$navigateTo(Details, {
                    animated: true,
                    props: {
                        item: row.item
                    },
                    transition: {
                        name: "slide",
                        duration: 150,
                        curve: "easeOut"
                    },
                });
            },
            showFilters: function () {
                action('Filtrer par ?', 'Annuler',['Date ↑', 'Date ↓', 'Prix ↑', 'Prix ↓']).then( choice => {
                    switch (choice) {
                        case 'Date ↑':
                            this.sorts.date.asc = true;
                            this.sorts.date.desc = false;
                            break;
                        case 'Date ↓':
                            this.sorts.date.asc = false;
                            this.sorts.date.desc = true;
                            break;
                        case 'Prix ↑':
                            this.sorts.price.asc = true;
                            this.sorts.price.desc = false;
                            break;
                        case 'Prix ↓':
                            this.sorts.price.asc = false;
                            this.sorts.price.desc = true;
                            break;
                    }
                } ).then(res => {
                    alert(res)
                    if (res !== undefined) {
                        this.page = 1;
                        this.data = [];
                        this.fetchData({})
                    }
                })
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
            onNavigatedTo: function () {
                this.fetchData({}).then(res => {});
            },
            fetchData: function (params) {
                this.loading = !params.loadingMore && !params.refresh;
                let page = params.page || this.page;
                let dateSort = this.sorts.date.asc ? 1 : -1;
                let priceSort = this.sorts.price.asc ? 1 : -1;
                let regionFilter = this.filters.towns.join(',');

                return API.fetchArticles({
                    page,
                    // limit: 5,
                    dateSort: dateSort,
                    priceSort: priceSort,
                    region: regionFilter
                }).then(res => {
                    const docs = res.data.docs || [];
                    this.maxPages = res.data.pages;
                    this.hasMoreItems = docs.length >= res.data.limit;
                    if (params.loadingMore) {
                        this.data = this.data.concat(docs);
                    } else {
                        this.data = docs;
                    }

                    if (docs.length && this.page <= this.maxPages)
                        this.page ++;

                    // this.refreshList();
                    this.loading = false;
                    return Promise.resolve(true);
                }).catch(err => {
                    this.loading = false;
                    return Promise.reject(false)
                });
            }
        },
        components: {
            ArticleGridView,
            ArticleListView,
            AddArticleModal,
            Details,
            LocationFilterModal
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
    .no_network {
        color: #000;
        font-size: 18;
        margin-top: 20;
        font-weight: bold;
        margin-left: auto;
        margin-right: auto;
    }
</style>
