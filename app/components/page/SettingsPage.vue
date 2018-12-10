<template>
    <Page>
        <ActionBar class="action-bar" title="Créer une annonce">
            <ActionItem ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
        </ActionBar>

        <ScrollView orientation="vertical">
            <GridLayout columns="auto,auto" rows="auto,auto,auto,auto,auto,auto,auto,auto">
                <Image src="res://icon" ror="0" col="0" width="90" height="90" colSpan="2"/>
                <Label text="El manifico" class="name" row="1" col="0" width="50%"/>
                <Label text="+237 78 96 54 12" class="phone" row="1" col="1" width="50%"/>
                <Label text="xxx@yyy.com" class="email" row="2" col="0" width="50%"/>
                <Label text="Yaounde / CM" class="location" row="2" col="1" width="50%"/>
                <Label row="3" col="0" class="line" colSpan="2"/>
            </GridLayout>

        </ScrollView>
    </Page>
</template>

<script>
    export default {
        name: "settings-page"
    }
</script>

<style scoped lang="scss">
    .name, .email {
        text-align: right;
        padding-right: 8;
        margin-top: 6;
    }
    .location, .phone {
        text-align: left;
        padding-left: 8;
        margin-top: 6;
    }
    .line {
        border-bottom-width: 1;
        width: 100%;
    }
</style>