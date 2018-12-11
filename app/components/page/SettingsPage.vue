<template>
    <Page>
        <ActionBar class="action-bar" title="Profil">
            <ActionItem ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
        </ActionBar>

        <ScrollView orientation="vertical">

            <DockLayout width="auto" height="auto" stretchLastChild="false">
                <GridLayout columns="auto,auto" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" dock="top">
                    <Image src="res://ic_default_avatar" ror="0" col="0" width="90" height="90" colSpan="2" class="m-t-10"/>
                    <Label text="El manifico" class="name" row="1" col="0" width="50%"/>
                    <Label text="+237 78 96 54 12" class="phone" row="1" col="1" width="50%"/>
                    <Label text="xxx@yyy.com" class="email" row="2" col="0" width="50%"/>
                    <Label text="Yaounde / CM" class="location" row="2" col="1" width="50%"/>
                    <Label row="3" col="1" text="Mes annonces" class="my-announcements"/>

                    <Label row="4" col="0" class="line" colSpan="2"/>


                    <Label row="5" col="0" class="option-label" text="Numéro de tel. Visible" width="50%"/>
                    <Switch checked="true" row="5" col="1" color="#ec4980" class="option-switch"/>

                    <Label row="6" col="0" class="option-label" text="Accepter les emails" width="50%"/>
                    <Switch checked="true" row="6" col="1" color="#ec4980" class="option-switch" />

                    <Label row="7" col="0" class="option-label" text="Accepter les appels téléphoniques" width="50%"/>
                    <Switch checked="true" row="7" col="1" color="#ec4980" class="option-switch" />

                    <Label row="8" col="0" class="option-label" text="Accepter le chat" width="50%"/>
                    <Switch checked="false" row="8" col="1" color="#ec4980" class="option-switch" />

                </GridLayout>

                <Button class="btn btn-primary" text="Deconnexion" dock="bottom" height="60" @tap="logout" />

            </DockLayout>

        </ScrollView>
    </Page>
</template>

<script>
    import LoginPage from './LoginPage'
    export default {
        name: "settings-page",
        data: function () {
            return {}
        },
        components: {
            LoginPage
        },
        computed: {},
        methods: {
            logout: function () {
                localStorage.clear();
                this.$navigateTo(LoginPage, {
                    animated: true,
                    clearHistory: true,
                    transition: {
                        name: "slide",
                        duration: 150,
                        curve: "easeOut"
                    },
                    props: {
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    Label {
        padding-right: 10;
        padding-left: 10;
        margin-top: 6;
        font-weight: bold;
        font-size: 14;
    }
    .name, .email {
        text-align: right;
    }
    .location, .phone {
        text-align: left;
    }
    .line {
        border-bottom-width: 1;
        width: 100%;
    }

    .my-announcements {
        text-align: right;
        color: #ec4980;
        font-style: italic;
    }

    .option-switch, .option-label {
        margin-top: 10;
        padding: 10;
    }

    .option-label {
        font-size: 14;
        font-weight: bold;
    }
</style>
