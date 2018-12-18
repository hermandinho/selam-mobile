<template>
    <Page>
        <ActionBar class="action-bar" title="Profil">
            <!--<ActionItem ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>-->
        </ActionBar>

        <ScrollView orientation="vertical">

            <DockLayout width="auto" height="auto" stretchLastChild="false">
                <GridLayout columns="auto,auto" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" dock="top">
                    <Image :src="me.picture || 'res://ic_default_avatar'" ror="0" col="0" width="90" height="90" colSpan="2" class="m-t-10"/>
                    <Label :text="me.name" class="name" row="1" col="0" width="50%"/>
                    <Label text="+237 78 96 54 12" class="phone" row="1" col="1" width="50%"/>
                    <Label :text="me.email" class="email" row="2" col="0" width="50%"/>
                    <!--<Label text="Yaounde / CM" class="location" row="2" col="1" width="50%"/>-->
                    <Label row="3" col="0" colSpan="2" text="Mes annonces" class="my-announcements"/>

                    <Label row="4" col="0" class="line" colSpan="2"/>
<!--
                    <Label row="5" col="0" class="option-label" text="Numéro de tel. Visible" width="50%"/>
                    <Switch checked="true" row="5" col="1" color="#ec4980" class="option-switch"/>-->

                    <Label row="5" col="0" class="option-label" text="Accepter les emails" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'acceptEmail')" checked="me.acceptEmail" row="5" col="1" color="#ec4980" class="option-switch" />

                    <Label row="6" col="0" class="option-label" text="Accepter les appels téléphoniques" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'acceptPhone')" :checked="me.acceptPhone" row="6" col="1" color="#ec4980" class="option-switch" />

                    <Label row="7" col="0" class="option-label" text="Accepter les SMS" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'acceptSMS')" :checked="me.acceptSMS" row="7" col="1" color="#ec4980" class="option-switch" />

                    <Label row="8" col="0" class="option-label" text="Accepter le chat" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'acceptChats')" :checked="me.acceptChats" row="8" col="1" color="#ec4980" class="option-switch" />

                </GridLayout>

                <Button :isEnabled="canLogout" class="btn btn-primary" text="Deconnexion" dock="bottom" height="60" @tap="logout" />

            </DockLayout>

        </ScrollView>
    </Page>
</template>

<script>
    import Vuex from 'vuex';
    import LoginPage from './LoginPage'
    import API from '../../api';
    export default {
        name: "settings-page",
        data: function () {
            return {
                refreshMe: false,
                canLogout: true
            }
        },
        components: {
            LoginPage
        },
        computed: {
            ...Vuex.mapGetters(['getPusherInstance']),
            me: function () {
                const user = localStorage.getItem('user');
                if (!user) return;
                this.refreshMe = !this.refreshMe;
                return JSON.parse(user);
            }
        },
        methods: {
            navigate: function () {
                localStorage.clear();
                if (this.getPusherInstance) {
                    console.log('DISCONNECT PUSHER');
                    this.getPusherInstance.unsubscribeAll();
                    this.getPusherInstance.disconnect();
                }
                this.$navigateTo(LoginPage, {
                    animated: true,
                    clearHistory: true,
                    frame: 'mainFrame',
                    transition: {
                        name: "slide",
                        duration: 150,
                        curve: "easeOut"
                    },
                    props: {
                    }
                });
            },
            logout: function () {
                API.logout().then(res => {
                    this.navigate();
                }).catch(err => {
                    console.log('LOGOUT ERROR: ' , err);
                    this.navigate();
                });
            },
            handleSelectChange: function ({ value }, option) {
                const params = {};
                this.canLogout = false;
                params[option] = value;
                API.updateProfile(this.me._id, params).then(res => {
                    this.canLogout = true;
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(res.data));
                    this.refreshMe = !this.refreshMe;
                }).catch(err => {

                });
            }
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
