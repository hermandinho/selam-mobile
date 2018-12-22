<template>
    <Page @loaded="onLoaded">
        <ActionBar class="action-bar" title="Profil">
            <!--<ActionItem ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>-->
        </ActionBar>

        <ScrollView orientation="vertical">

            <DockLayout width="auto" height="auto" stretchLastChild="false">
                <GridLayout columns="auto,auto" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" dock="top">
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
                    <Switch v-if="hasPhoneNumber" @checkedChange="handleSelectChange($event, 'acceptPhone')" :checked="me.acceptPhone" row="6" col="1" color="#ec4980" class="option-switch" />
                    <Switch @tap="alertNoPhoneNumber" isEnabled="false" v-if="!hasPhoneNumber" :checked="false" row="6" col="1" class="option-switch" />

                    <Label row="7" col="0" class="option-label" text="Accepter les SMS" width="50%"/>
                    <Switch v-if="hasPhoneNumber" @checkedChange="handleSelectChange($event, 'acceptSMS')" :checked="me.acceptSMS" row="7" col="1" color="#ec4980" class="option-switch" />
                    <Switch @tap="alertNoPhoneNumber" isEnabled="false" v-if="!hasPhoneNumber" :checked="false" row="7" col="1" class="option-switch" />

                    <Label row="8" col="0" class="option-label" text="Accepter le chat" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'acceptChats')" :checked="me.acceptChats" row="8" col="1" color="#ec4980" class="option-switch" />

                    <Label row="9" col="0" class="option-label title section-title" text="Notifications" colSpan="2" />

                    <Label row="10" col="0" class="option-label" text="Nouveaux messages" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'notifyOnNewMessage')" :checked="me.notifyOnNewMessage" row="10" col="1" color="#ec4980" class="option-switch" />

                    <Label row="11" col="0" class="option-label" text="Visites sur mes annonces" width="50%"/>
                    <Switch @checkedChange="handleSelectChange($event, 'notifyOnArticleVisite')" :checked="me.notifyOnArticleVisite" row="11" col="1" color="#ec4980" class="option-switch" />

                    <Label row="12" col="0" class="option-label" text="Nouvelles annonces" width="50%"/>
                    <Button
                        @tap="openCategoriesSelectModal"
                        row="12" col="1"
                        color="#ec4980"
                        class="option-switch"
                        :text="selectedCategoriesNames.length ?
                                selectedCategoriesNames.length === 1 ? selectedCategoriesNames[0] : (selectedCategoriesNames[0] + ' et ' + (selectedCategoriesNames.length - 1) + '+')
                                : 'Choisir les catégories'" />
                </GridLayout>

                <Button :isEnabled="canLogout" class="btn btn-primary" text="Deconnexion" dock="bottom" height="60" @tap="logout" />

            </DockLayout>

        </ScrollView>
    </Page>
</template>

<script>
    import Vuex from 'vuex';
    import LoginPage from './LoginPage'
    import CategoriesModal from '../modals/NotificationsChannelsModal';
    import API from '../../api';

    export default {
        name: "settings-page",
        data: function () {
            return {
                refreshMe: false,
                canLogout: true,
                selectedCategories: [],
                selectedCategoriesNames: [],
            }
        },
        components: {
            LoginPage, CategoriesModal
        },
        watch: {
            getCategories: function (cats) {
                this.selectedCategoriesNames = [];
                cats.map(c => {
                    if (this.selectedCategories.indexOf(c._id) !== -1) {
                        this.selectedCategoriesNames.push(c.name);
                    }
                })
            },
            selectedCategories: function (selected) {
                this.selectedCategoriesNames = [];
                this.getCategories.map(c => {
                    if (this.selectedCategories.indexOf(c._id) !== -1) {
                        this.selectedCategoriesNames.push(c.name);
                    }
                })
            }
        },
        computed: {
            ...Vuex.mapGetters(['getPusherInstance', 'getCategories']),
            me: function () {
                const user = localStorage.getItem('user');
                if (!user) return;
                this.refreshMe = !this.refreshMe;
                if (user.pushCategories) {
                    user.pushCategories.map(c => {
                        this.selectedCategoriesNames.push(c.name);
                    })
                }
                return JSON.parse(user);
            },
            hasPhoneNumber: function () {
                return this.me && this.me.phoneNumber;
            }
        },
        methods: {
            onLoaded: function () {
                if (this.me && this.me.pushCategories && this.me.pushCategories.length) {
                    this.selectedCategories = this.me.pushCategories;
                }
            },
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
            },
            alertNoPhoneNumber: function () {
                alert("Vous n'avez pas configurer votre numéro de téléphone.");
            },
            openCategoriesSelectModal: function () {
                this.$showModal(CategoriesModal, {
                    fullscreen: true,
                    animation: true,
                    props: {
                        selected: this.selectedCategories
                    }
                }).then(res => {
                    if (!res) return;
                    this.selectedCategories = [];
                    const selected = res.filter(r => r.selected === true);
                    selected.map(s => this.selectedCategories.push(s._id));
                    this.handleSelectChange({ value: this.selectedCategories }, 'pushCategories');
                })
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
    .section-title {
        font-size: 18;
        text-align: center;
    }
</style>
