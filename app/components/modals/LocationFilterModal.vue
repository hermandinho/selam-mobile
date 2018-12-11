<template>
    <Frame>
        <Page  verticalAlignment="top"  @navigatedTo="onNavigatedTo">
            <ActionBar class="action-bar" title="Région">
                <ActionItem @tap="$modal.close({selectedTowns})"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
            </ActionBar>

            <ScrollView orientation="horizontal">
                <GridLayout class="m-4 p-10" colomns="*" rows="auto,auto,*" width="100%" orientation="horizontal">
                    <ActivityIndicator row="4" :busy="loading" rowSpan="1" color="#ec4980" />

                    <ListPicker v-if="countries.length" :items="countries" selectedIndex="0" col="0" row="0" width="90%"
                                @selectedIndexChange="selectedIndexChanged" @loaded="onListViewLoaded"/>

                    <!--<Label class="line" row="1" col="0" >{{ selectedTowns.length }}</Label>-->
                    <ListView for="item in filteredTowns" @itemTap="townSelected" row="2" height="*">
                        <v-template>
                            <FlexboxLayout flexDirection="columns">
                                <Label :text="item.name" class="p-10" flexGrow="5"/>

                                <Switch checked="false" flexGrow="1" @checkedChange="handleSelectChange($event, item)"/>
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
            towns: { type: Array, default: [] },
            country: { type: String, default: "" },
        },
        data: function () {
            return {
                location: {
                    country: 'x',
                    town: 'Y'
                },
                countries: [],
                towns: [],
                filteredTowns: [],
                listView: null,
                loading: false,
                selectedTowns: []
            }
        },
        watch: {
            countries: function (n) {
                this.selectedTowns = [];
                this.filteredTowns = this.towns.filter(t => t.country.name === n[0]);
            }
        },
        methods: {
            onNavigatedTo: function () {
                this.loading = true;
                API.fetchConfigFilters().then(res => {
                    const data = res.data;
                    data.countries.map(c => {
                        this.countries.push(c.name);
                    })
                    this.towns = data.towns;
                    /*data.towns.map(c => {
                        this.towns.push(c.name);
                    })*/
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                })
            },
            selectedIndexChanged: function ({value}) {
                this.selectedTowns = [];
                const ctry = this.countries[value];
                this.filteredTowns = this.towns.filter(t => t.country.name === ctry);
            },
            onListViewLoaded: function ({object}) {
            },
            townSelected: function (item) {
            },
            handleSelectChange: function ({value}, item) {
                if (value) {
                    this.selectedTowns.push(item);
                } else {
                    this.selectedTowns = this.selectedTowns.filter(t => t._id !== item._id)
                }
            }
        }
    }
</script>

<style scoped>
    .line {
        border-bottom-width: 1;
    }
</style>
