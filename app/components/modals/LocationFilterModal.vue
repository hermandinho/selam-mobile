<template>
    <Frame>
        <Page  verticalAlignment="top"  @navigatedTo="onNavigatedTo" @unLoaded="resetState">
            <ActionBar class="action-bar" title="Région">
                <ActionItem @tap="$modal.close({selectedTowns, selectedCountry})"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_save" android.position="actionBar"/>
            </ActionBar>

            <ScrollView orientation="horizontal">
                <GridLayout class="m-4 p-10" colomns="*" rows="auto,auto,*" width="100%" orientation="horizontal">
                    <ActivityIndicator row="4" :busy="loading" rowSpan="1" color="#ec4980" />

                    <ListPicker v-if="countries.length" :items="countries" :selectedIndex="selectedCountryIndex" col="0" row="0" width="90%"
                                @selectedIndexChange="selectedIndexChanged" @loaded="onListViewLoaded"/>

                    <Label class="line" row="1" col="0" :text="preselectedTownsIds"/>
                    <ListView for="item in filteredTowns" @itemTap="townSelected" row="2" height="*" ref="townsListView">
                        <v-template>
                            <FlexboxLayout flexDirection="columns" :key="item._id">
                                <Label :text="item.name" class="p-10" flexGrow="5"/>

                                <Switch v-model="preselectedTownsIds[item._id]" flexGrow="1" @checkedChange="handleSelectChange($event, item)"/>
                            </FlexboxLayout>
                        </v-template>
                    </ListView>
                </GridLayout>
            </ScrollView>
        </Page>
    </Frame>
</template>

<script>
    import API from '../../api'
    export default {
        name: "location-filter-modal",
        props: {
            oldTowns: { type: Array, default: [] },
            country: { type: String, default: "" },
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
                dirty: false
            }
        },
        watch: {
            countries: function (n) {
                this.resetState();
                this.filteredTowns = this.towns.filter(t => t.country.name === n[0]);
            },
            selectedCountryIndex: function (n, o) {
                this.resetState();
                this.filteredTowns = this.towns.filter(t => t.country.name === this.countries[n]);
            },
        },
        computed: {  },
        methods: {
            resetState: function () {
                if (this.dirty) {
                    this.preselectedTownsIds = [];
                    this.selectedTowns = [];
                }
            },
            onNavigatedTo: function () {
                this.loading = true;
                this.dirty = false;
                API.fetchConfigFilters().then(res => {
                    const data = res.data;
                    data.countries.map(c => {
                        this.countries.push(c.name);
                    });
                    this.towns = data.towns;

                    if (this.country) {
                        this.selectedCountryIndex = this.countries.indexOf(this.country) || 0;
                    }

                    if (this.oldTowns && this.oldTowns.length) {
                        this.towns.map(t => {
                            this.oldTowns.map(o => {
                                if (t._id === o) {
                                    console.log('SELECTED ' + t.name);
                                    this.selectedTowns.push(t);
                                    this.preselectedTownsIds[o] = true;
                                }
                            })
                        })
                    }
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })
            },
            selectedIndexChanged: function ({value, oldValue}) {
                // alert(value + ' --> ' + oldValue + ' ------> ' + this.selectedCountryIndex);
                this.dirty = true;
                this.resetState();

                const ctry = this.countries[value];
                this.selectedCountry = ctry;
                this.filteredTowns = this.towns.filter(t => t.country.name === ctry);
               /* if (this.$refs.townsListView) {
                    this.$refs.townsListView.refresh();
                }*/
            },
            onListViewLoaded: function ({object}) {
            },
            townSelected: function (item) {
            },
            handleSelectChange: function ({value}, item) {
                // this.dirty = true;
                this.resetState();
                if (value) {
                    this.selectedTowns.push(item);
                } else {
                    this.selectedTowns = this.selectedTowns.filter(t => t._id !== item._id)
                }
            },
            isTownSelected: function (item) {
                return this.selectedTowns.filter(t => t._id !== item._id).length > 0;
            }
        }
    }
</script>

<style scoped>
    .line {
        border-bottom-width: 1;
    }
    ListPicker {
    }
</style>
