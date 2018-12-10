<template>
    <GridLayout
        columns="*"
        rows="3*,2*"
        width="auto"
        height="250"
        backgroundColor="transparent"
        class="m-b-10"
    >
        <Image src="res://ic_no_image" stretch="aspectFit" left="0" top="0" width="100%" height="100%" class="img-thumbnail"/>

        <GridLayout row="1" col="0" backgroundColor="lightgray" columns="*,*" rows="*,*,*,*" class="p-10">
            <Label class="name" text="Article avec un tres long titre a vendre ici." row="0" col="0" />
            <Label class="price" text="5000 CFA" row="0" col="1" />

            <Label class="date" text="Publié le 20/20/2018" colSpan="2" row="1" col="0" />
            <Label class="location" colSpan="2" text="Yaoundé / CM" row="2" col="0" />
            <Label class="user" colSpan="2" text="El manifico" row="3" col="0" />
        </GridLayout>
    </GridLayout>
</template>

<script>

    export default {
        name: "articles-grid-view",
        props: {
            data: {
                required: true
            },
            index: {
                default: 0
            }
        },
        data: function () {
            return {}
        },
        components: {

        },
        methods: {
            onPullToRefreshInitiated: function ({object}) {
                object.notifyPullToRefreshFinished();
                //TODO emit event to parent
            }
        }
    }
</script>

<style scoped lang="scss">
    .name, .price {
        font-weight: bold;
        font-size: 15;
    }

    .price {
        text-align: right;
    }

    .date, .location, .user {
        font-style: italic;
        font-weight: normal;
        font-size: 10;
    }
    .img-thumbnail {
        border-width: 0.5;
        border-bottom-width: 0;
    }
</style>
