<template>
    <Frame>
        <Page @navigatedTo="onNavigatedTo">
            <ActionBar class="action-bar" title="Région">
                <ActionItem @tap="$modal.close('HELLO MAN')"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
            </ActionBar>

            <ScrollView orientation="horizontal">
                <GridLayout class="m-8" colomns="*" rows="auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto" width="100%">
                    <ListPicker :items="countries" selectedIndex="0" col="0" row="0" width="100%"
                                @selectedIndexChange="selectedIndexChanged" @loaded="onListViewLoaded($event)"/>

                    <Label class="line" row="1" col="0">{{ countries }}</Label>
                    <Label class="" row="2" col="0" text="HELLO"/>
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
                listView: null
            }
        },
        methods: {
            onNavigatedTo: function () {
                API.fetchConfigFilters().then(res => {
                    const data = res.data;
                    data.countries.map(c => {
                        this.countries.push(c.name);
                    })
                    data.towns.map(c => {
                        this.towns.push(c.name);
                    })
                    if (this.listView) {
                        this.listView.refresh();
                        alert(0)
                    }
                })
            },
            selectedIndexChanged: function (index) {
                alert(index)
            },
            onListViewLoaded: function ({object}) {
                this.listView = object;
                alert('Loaded', Object.keys(object));
            }
        }
    }
</script>

<style scoped>
    .line {
        border-bottom-width: 1;
    }
</style>
