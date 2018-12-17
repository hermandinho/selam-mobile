<template>
    <Frame>
    <Page  verticalAlignment="top"  @navigatedTo="onNavigatedTo">
        <ActionBar class="action-bar" title="Région">
            <NavigationButton @tap="$modal.close(false)" android.systemIcon="ic_menu_back" />
            <ActionItem @tap="$modal.close(true)"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_save" android.position="actionBar"/>
        </ActionBar>

        <ScrollView orientation="horizontal">
            <StackLayout orientation="vertical" width="100%">
                <SegmentedBar selectedBackgroundColor="#ec4980" v-model="selectedFiltersTab">
                    <SegmentedBarItem title="Lieu" />
                    <SegmentedBarItem title="Options" />
                </SegmentedBar>

                <GridLayout class="m-4 p-8" colomns="*" rows="auto,*,*,*" width="100%" orientation="horizontal"  v-show="selectedFiltersTab === 0">
                    <ListPicker v-if="countries.length" :items="countries" :selectedIndex="selectedCountryIndex" col="0" row="1" width="90%"
                                @selectedIndexChange="selectedIndexChanged" @loaded="onListViewLoaded"/>
                    <!--<Label class="line" row="1" col="0" :text="preselectedTownsIds"/>-->
                    <ListView for="item in filteredTowns" row="2" height="100%" ref="townsListView">
                        <v-template>
                            <FlexboxLayout flexDirection="columns" :key="item && item._id">
                                <Label :text="item.name" class="p-10 option-label" flexGrow="5"/>

                                <Switch v-model="preselectedTowns[item && item._id || null]" flexGrow="1" @checkedChange="handleSelectChange($event, item)"/>
                            </FlexboxLayout>
                        </v-template>
                    </ListView>
                </GridLayout>

                <GridLayout colomns="*" rows="auto" width="100%" orientation="horizontal" v-show="selectedFiltersTab === 1" class="p-8">
                    <ListView for="option in filterOptions"  height="100%" row="0">
                        <v-template>
                            <FlexboxLayout flexDirection="columns" :key="option.label">
                                <Label :text="option.label" class="p-10 option-label" flexGrow="5"/>
                                <Switch v-model="options[option.key]" flexGrow="1" @checkedChange="handleOptionSelectChange($event, option)"/>
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
        name: "location-filter-modal",
        props: {
        },
        data: function () {
            return {
                countries: [],
                towns: [],
                filteredTowns: [],
                listView: null,
                loading: false,
                selectedTowns: [],
                selectedCountry: '',
                selectedCountryIndex: 0,
                preselectedTownsIds: [],
                dirty: false,
                selectedFiltersTab: 0,
                filterOptions: [{ label: 'Prix Fix', key: 'fixedPrice', value: false }, { label: 'Echange', key: 'exchange', value: true }],
                options: {}
            }
        },
        watch: {
            countries: function (n) {
                this.filteredTowns = this.towns.filter(t => t.country.name === n[0]);
            },
            selectedCountryIndex: function (n, o) {
                this.filteredTowns = this.towns.filter(t => t.country.name === this.countries[n]);
            },
        },
        computed: {
            ...Vuex.mapGetters(['getSearchFilters']),
            preselectedTowns: function () {
                const data = this.getSearchFilters.selectedTowns;
                const res ={};
                this.filteredTowns.map(f => {
                    data.map(d => {
                        if (d._id === f._id) {
                            res[d._id] = true
                        }
                    })
                });
                return res;
            }
        },
        methods: {
            ...Vuex.mapActions([
                'toggleTownSelect', 'toggleCountrySelect', 'toggleSearchOption'
            ]),
            onNavigatedTo: function () {
                if (this.getSearchFilters) {
                    this.towns = this.getSearchFilters.towns || [];
                    this.countries = this.getSearchFilters.countries || [];
                    this.selectedCountry = this.getSearchFilters.selectedCountry;
                    this.selectedCountryIndex = this.countries.indexOf(this.selectedCountry);
                    this.filteredTowns = this.towns.filter(t => t.country.name === this.selectedCountry);
                    this.selectedTowns = this.getSearchFilters.selectedTowns || [];
                    this.options = JSON.parse(JSON.stringify(this.getSearchFilters.options)) || {};
                }
            },
            selectedIndexChanged: function ({value, oldValue}) {
                const ctry = this.countries[value];
                this.filteredTowns = this.towns.filter(t => t.country.name === ctry);
                this.toggleCountrySelect(ctry);
                this.toggleTownSelect(null);
            },
            onListViewLoaded: function ({object}) {
            },
            handleSelectChange: function ({value}, item) {
                this.toggleTownSelect(item);
            },
            handleOptionSelectChange: function ({value}, item) {
                item.value = value;
                this.toggleSearchOption(item);
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
