<template>
    <Page>
        <ActionBar class="action-bar" color="#ffffff">
            <NavigationButton @tap="onBackButtonTap" android.systemIcon="ic_menu_back" />
            <Label class="action-bar-title" :text="user.name"></Label>
        </ActionBar>
        <Label>HELLO WORLD</Label>
    </Page>
</template>

<script>
    export default {
        props: {
            user: {
                type: Object,
                default: () => { return { name: 'System', id: -1 } },
                required: true
            }
        },
        name: "chat-page",
        data: function () {
            return {}
        },
        methods: {
            onBackButtonTap: function () {
                this.$navigateBack();
            }
        }
    }
</script>

<style scoped>

</style>