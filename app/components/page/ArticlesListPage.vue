<template>
    <Page verticalAlignment="top" @navigatedTo="onNavigatedTo">
        <ActionBar class="action-bar" color="#ffffff">
            <!--<NavigationButton tap="onBackButtonTap" android.systemIcon="ic_menu_back" />-->
            <Label class="action-bar-title" text="Selam Mobile"></Label>
        </ActionBar>
        <GridLayout class="m-5 p-0" rows="auto,auto,*" columns="*" v-if="getNetWorkStatus">
            <SearchBar @loaded="onSearchBoxLoaded" row="0"
                       id="articleSearchBar"
                       hint="Rechercher ..."
                       class="m-b-5"
                       height="auto"
                       v-model="searchPhrase"
                       @submit="onSubmit" />
            <GridLayout columns="*,auto,auto,auto" rows="auto" height="auto" row="1" class="m-b-5">
                <Label class="results-count" col="0" row="0">{{ !isDataEmpty ? data.length : 0 }} résultat(s) sur {{ totalData }} </Label>
                <Ripple col="1" row="0" @tap="showLocationFilterModal">
                    <Image src="res://ic_marker" class="filter"stretch="aspectFit" width="30" />
                </Ripple>
                <Ripple col="2" row="0" @tap="showFilters">
                    <Image src="res://ic_filter" class="filter" stretch="aspectFit" width="30"/>
                </Ripple>
                <!--<Image v-if="false" @tap="refreshList()" class="grid filter" col="2" row="0" :src="viewMode === 'grid' ? 'res://filter_grid_primary' : 'res://filter_grid_black'" ></Image>
                <Image v-if="false" @tap="refreshList()" class="grid filter" col="3" row="0" :src="viewMode === 'list' ? 'res://filter_list_primary' : 'res://filter_list_black'" ></Image>-->
            </GridLayout>

            <ActivityIndicator width="100" row="2" :busy="loading" rowSpan="1" colSpan="1" color="#ec4980" />

            <ScrollView orientation="vertical" height="100%" row="2">
                <RadListView ref="gridView"
                    layout="grid"
                    itemWidth="40%"
                    for="(item, index) in data"
                    :gridSpanCount="isDataEmpty ? 1 : (isTablet ? 3 : 1)"
                    :selectionBehavior="'None'"
                    pullToRefresh="true"
                    itemInsertAnimation="Fade"
                    @pullToRefreshInitiated="onPullToRefreshInitiated"
                    @itemTap="showDetails"
                    :loadOnDemandMode="hasMoreItems ? 'Auto' : 'None'"
                    @loadMoreDataRequested="loadMore"
                    loadOnDemandBufferSize="3"
                >
                    <v-template name="full" if="item._id !== 'empty'">
                        <article-grid-view :class="index === 0 && !isTablet ? 'first-article' : ''" :data="item" :index="index" width="99%"></article-grid-view>
                    </v-template>
                    <v-template name="empty" if="item._id === 'empty'">
                        <FlexboxLayout class="empty-list-container" flexDirection="column" justifyContent="center"
                                       alignItems="center" alignContent="center">
                            <Label alignSelf="center" class="empty-list-text">Liste vide pour l'instant</Label>
                        </FlexboxLayout>
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
            <Button text="Réessayer" @tap="fetchData({})" />
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
    import LIBS from '../../libs'

    export default {
        name: "articles-list-page",
        data: function () {
            return {
                searchPhrase: '',
                viewMode: 'grid',
                data: [/*1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18*/],
                /*filters: {
                    towns: [],
                    country: ''
                },*/
                page: 1,
                maxPages: 1,
                totalData: 0,
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
            ...Vuex.mapGetters(['getNetWorkStatus', 'getSearchFilters']),
            isTablet: function () {
                return platform.device.deviceType.toLowerCase() === 'tablet';
            },
            isDataEmpty: function () {
                return this.data.length === 0 || this.data[0]._id === 'empty'
            },
            filters: function () {
                return {
                    towns: this.getSearchFilters.selectedTowns || [],
                    country: this.getSearchFilters.selectedCountry || []
                }
            }
        },
        methods: {
            ...Vuex.mapActions(['fetchedSearchFilters']),
            onSubmit: function() {
                this.data = [];
                this.page = 1;
                this.fetchData({}).then(res => {})
            },
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
                this.totalData = 0;
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
                    }
                }).then(res => {
                    if (!res) {
                        return;
                    }
                    this.fetchData({}).then(res => { }).catch(err => {});
                    this.filters.towns = [];
                    this.filters.country = '';
                    this.getSearchFilters.selectedTowns.map(t => {
                        this.filters.towns.push(t._id);
                    });
                    this.filters.country = res.selectedCountry || '';
                    this.page = 1;
                    this.data = [];
                    this.fetchData({}).then(res => { }).catch(err => {});
                })
            },
            showDetails: function ({ object, item, view }) {
                this.$navigateTo(Details, {
                    animated: true,
                    frame: 'articlesFrame',
                    transition: {
                        name: "slide",
                        duration: 250,
                        curve: "easeIn"
                    },
                    props: {
                        article: item,
                    }
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
                    this.page = 1;
                    this.data = [];
                    this.fetchData({})
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
            onNavigatedTo: function ({isBackNavigation}) {
                LIBS.createAddBanner();
                if (isBackNavigation) return;
                this.fetchData({}).then(res => {}).catch(err => {});
                this.fetchFilters();
            },
            fetchData: function (params) {
                this.loading = !params.loadingMore && !params.refresh;
                let page = params.page || this.page;
                let dateSort = this.sorts.date.asc ? 1 : -1;
                let priceSort = this.sorts.price.asc ? 1 : -1;
                let priceFixed = this.getSearchFilters.options.fixedPrice;
                let exchange = this.getSearchFilters.options.exchange;
                let regionFilter = this.filters.towns.join(',');
                let search = this.searchPhrase.trim();

                return API.fetchArticles({
                    page,
                    // limit: 5,
                    dateSort: dateSort,
                    priceSort: priceSort,
                    region: regionFilter,
                    search: search,
                    priceFixed: priceFixed,
                    exchange: exchange,
                }).then(res => {
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

                    if (docs.length === 0) {
                        this.data.push({ _id: 'empty' });
                    }
                    // this.refreshList();
                    this.loading = false;
                    return Promise.resolve(true);
                }).catch(err => {
                    this.loading = false;
                    return Promise.reject(false)
                });
            },
            fetchFilters: function () {
                API.fetchConfigFilters().then(res => {
                    const data = res.data;
                    const countries = [];
                    const towns = data.towns;

                    data.countries.map(c => {
                        countries.push(c.name);
                    });

                    this.fetchedSearchFilters({ countries, towns });
                })
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
        margin-bottom: 7%;
        z-index: 10000;
    }
    .no_network {
        color: #000;
        font-size: 18;
        margin-top: 20;
        font-weight: bold;
        margin-left: auto;
        margin-right: auto;
    }
    .empty-list-text {
        color: #000;
        font-weight: bold;
        font-size: 25;
        opacity: .2;
    }

    .empty-list-container {
        width: 100%;
        height: 100%;
    }

    .first-article {
        margin-top: 15;
    }
    SearchBar {
        border-width: 1 1 1 1;
        border-color: #ffffff;
        border-radius: 15;
    }
</style>
