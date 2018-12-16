<template>
    <Frame>
        <chat-page :user="user" :text="text" :is-modal="true"></chat-page>
    </Frame>
</template>

<script>
    import ChatPage from '../page/ChatPage'
    export default {
        props: {
            user: {
                type: Object,
                default: () => {
                    return {name: 'System', id: -1}
                },
                required: true
            },
            text: {
                type: String,
                default: ''
            },
            fromFrame: {
                type: String,
                default: 'chatFrame'
            }
        },
        name: "chat-page-modal",
        data: function () {
            return {}
        },
        components: {
            ChatPage
        }
    }
</script>

<style scoped>

</style>