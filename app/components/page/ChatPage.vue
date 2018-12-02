<template>
    <Page verticalAlignment="top">
        <ActionBar class="action-bar" color="#ffffff">
            <NavigationButton @tap="onBackButtonTap" android.systemIcon="ic_menu_back">
                <Label>X</Label>
            </NavigationButton>
            <Label class="action-bar-title" :text="user.name"></Label>
        </ActionBar>

        <StackLayout orientation="vertical" width="auto" height="auto" class="p-4"
                     backgroundColor="white">
            <ScrollView orientation="vertical" height="92%">
                <StackLayout orientation="vertical" backgroundColor="lightgray">

                    <FlexboxLayout orientation="vertical" height="100">
                        <Label text="1" height="50"></Label>
                        <Label text="1" height="50"></Label>
                    </FlexboxLayout>


                    <!--<Label text="Label 1" width="100%" height="50"
                           backgroundColor="red"/>
                    <Label text="Label 2" width="100%" height="50"
                           backgroundColor="green"/>-->
                </StackLayout>
            </ScrollView>
            <FlexboxLayout height="auto" flexDirection="row" class="p-8 m-8 m-t-8">
                <TextField autocorrect="true"
                           class="msg-field"
                           v-model="message"
                           color="black"
                           flexGrow="2"
                           returnKeyType="done"
                           hint="Enter text..." />
                <Label flexGrow="1">XXL</Label>
            </FlexboxLayout>
        </StackLayout>


    </Page>
</template>

<script>
    export default {
        props: {
            user: {
                type: Object,
                default: () => {
                    return {name: 'System', id: -1}
                },
                required: true
            }
        },
        name: "chat-page",
        data: function () {
            return {
                message: 'Hello dude !!'
            }
        },
        methods: {
            onBackButtonTap: function () {
                this.$navigateBack();
            }
        }
    }
</script>

<style scoped>
    .msg-field {
        border: 1px solid blue;
        color: black;
        margin-top: 3;
        font-size: 12;
    }
</style>