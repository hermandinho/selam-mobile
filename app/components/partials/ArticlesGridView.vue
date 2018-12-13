<template>
    <GridLayout
        columns="*"
        rows="3*,2*"
        width="auto"
        height="300"
        backgroundColor="transparent"
        class="m-b-10"
    >
        <Image :src="data.pictures[0] || 'res://ic_no_image'" :stretch="data.pictures[0] ? 'aspectFill' : 'aspectFit'" left="0" top="0" width="100%" height="100%" class="img-thumbnail"/>

        <GridLayout row="1" col="0" backgroundColor="lightgray" columns="*,*" rows="*,*,*,*" class="p-10">
            <Label class="name" :text="data.title" row="0" col="0" />
            <Label class="price" :text="data.price.amount | currency(data.currency || 'CFA') " row="0" col="1" />

            <Label class="date" colSpan="2" row="1" col="0" >Publié le {{ data.updated_at | toDate }}</Label>
            <Label class="location" colSpan="2" :text="data.region.country.name + ' / ' + data.region.name" row="2" col="0" />
            <Label class="user" colSpan="2" :text="data.user.name" row="3" col="0" />
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
        border-width: 0;
        border-bottom-width: 0;
    }
</style>
