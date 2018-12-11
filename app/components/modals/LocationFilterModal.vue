<template>
    <Frame>
        <Page  verticalAlignment="top"  @navigatedTo="onNavigatedTo">
            <ActionBar class="action-bar" title="Région">
                <ActionItem @tap="$modal.close('HELLO MAN')"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
            </ActionBar>

            <ScrollView orientation="horizontal" height="100%">
                <GridLayout class="m-4" colomns="*" rows="auto,auto,*" width="100%" orientation="horizontal">
                    <ActivityIndicator row="4" :busy="loading" rowSpan="2" color="#ec4980" />

                    <ListPicker v-if="countries.length" :items="countries" selectedIndex="0" col="0" row="0" width="100%"
                                @selectedIndexChange="selectedIndexChanged" @loaded="onListViewLoaded"/>

                    <!--<Label class="line" row="1" col="0" />-->
                    <ListView for="item in filteredTowns" @itemTap="townSelected" row="2" height="*">
                        <v-template>
                            <!-- Shows the list item label in the default color and style. -->
                            <Label :text="item.name" height="150"/>
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
                const ctry = this.countries[value];
                this.filteredTowns = this.towns.filter(t => t.country.name === ctry);
            },
            onListViewLoaded: function ({object}) {
            },
            townSelected: function (item) {
            }
        }
    }
</script>

<style scoped>
    .line {
        border-bottom-width: 1;
    }
</style>
