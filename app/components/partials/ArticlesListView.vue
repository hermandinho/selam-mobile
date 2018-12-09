<template>
    <!--<RadListView
            :layout="'linear'"
            itemHeight="250"
            itemWidth="auto"
            for="(item, index) in data"
            :selectionBehavior="'None'"
            pullToRefresh="true"
            @pullToRefreshInitiated="onPullToRefreshInitiated"
    >
        <v-template>
            <Label height="100">LABEL {{item}}</Label>
        </v-template>
    </RadListView>-->
    <Label height="100">LIST LABEL {{item}}</Label>
</template>

<script>
    export default {
        name: "articles-list-view",
        props: {
            data: {
                required: true
            }
        },
        data: function () {
            return {}
        },
        methods: {
            onPullToRefreshInitiated: function ({object}) {
                object.notifyPullToRefreshFinished();
                //TODO emit event to parent
            }
        }
    }
</script>

<style scoped>

</style>