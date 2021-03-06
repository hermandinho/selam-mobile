<template>
    <Page class="page-layout" backgroundSpanUnderStatusBar="true" actionBarHidden="true" statusBarStyle="dark" androidStatusBarBackground="#ec4980" @loaded="onLoaded">
        <ActionBar class="action-bar" color="#ffffff">
            <Label class="action-bar-title" text="Selam Login"></Label>
        </ActionBar>

        <Gradient direction="to right" colors="#ec4980, #Ac4980">
            <FlexboxLayout flexDirection="column" justifyContent="center" class="full-height">

                <Image src="res://logo" class="logo"/>

                <StackLayout class="container">
                    <FlexboxLayout alignItems="center" class="border-bottom" v-if="!isLogin">
                        <Image src="res://ic_user" width="20" height="20" class="icon-margin"/>
                        <TextField hint="Nom et prenom" v-model="user.name" class="form-input" autocorrect="false"/>
                    </FlexboxLayout>

                    <FlexboxLayout alignItems="center" class="border-bottom" v-if="!isLogin">
                        <Image src="res://ic_phone" width="20" height="20" class="icon-margin"/>
                        <TextField hint="Numéro de tel." v-model="user.phoneNumber" class="form-input" autocorrect="false" keyboardType="phone"/>
                    </FlexboxLayout>

                    <FlexboxLayout alignItems="center" class="border-bottom">
                        <Image src="res://ic_mail" width="30" height="30" class="icon-margin"/>
                        <TextField keyboardType="email" hint="Email" v-model="user.email" class="form-input" autocorrect="false"/>
                    </FlexboxLayout>

                    <FlexboxLayout alignItems="center" class="border-bottom">
                        <Image src="res://ic_padlock" width="30" height="30" class="icon-margin"/>
                        <TextField hint="Mot de passe" secure="true" v-model="user.password" class="form-input" autocorrect="false"/>
                    </FlexboxLayout>

                    <Button
                        v-show="!processing"
                        :text="isLogin ? 'Connexion' : 'Inscription'"
                        @tap="processForm"
                        class="my-btn"
                    />

                    <Button
                        v-show="processing"
                        :text="isLogin ? 'Connexion en cours ...' : 'Inscription en cours ...'"
                        :isEnabled="false"
                        class="my-btn disabled"
                    />

                    <FlexboxLayout justifyContent="space-between" alignItems="center" class="links">
                        <Label class="white-label" horizontalAllignment="left" @tap="isLogin = !isLogin" :text="!isLogin ? 'Connexion' :'Créer un compte'"/>
                        <Label class="white-label" horizontalAllignment="right" text="Mot de passe oublié"/>
                    </FlexboxLayout>
                </StackLayout>

            </FlexboxLayout>

        </Gradient>

    </Page>
</template>

<script>
    import {Pusher} from 'nativescript-pusher';
    import { messaging, Message } from "nativescript-plugin-firebase/messaging";
    import Vuex from 'vuex';
    import * as platform from 'tns-core-modules/platform';
    import App from '../App';
    import API from '../../api';

    export default {
        name: "login-page",
        data: function () {
            return {
                user: {
                    email: '',
                    password: '',
                    name: '',
                    phoneNumber: '',
                    uuid: platform.device.uuid,
                    os: platform.device.os,
                    version: platform.device.osVersion,
                    type: platform.device.deviceType.toLowerCase(),
                    pusherChannel: 'selammobile-' + platform.device.uuid + '-' + platform.device.os.toLowerCase() + '-' + platform.device.region.split(' ').join("").toLowerCase()
                },
                isLogin: true,
                processing: false
            }
        },
        components: {
            App
        },
        computed: {
            ...Vuex.mapGetters(['getPusherChannel'])
        },
        methods: {
            ...Vuex.mapActions(['setPusherChannel', 'receivedMessage', 'receivedTypingEvent']),
            onLoaded: function () {
                const isDev = API.getAPIBaseURL() == 'https://selammobile-api.serveo.net/api/v1';
                if (isDev) {
                    this.user.email = 'test@dev.com';
                    this.user.password = 'test';
                }
            },
            processForm: function () {
              if (this.isLogin) {
                  if (!this.user.email.trim().length || !this.user.password.trim().length) {
                      alert('Veuillez remplire tous les champs !!!');
                      return;
                  } else {
                      const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                      if (!regexp.test(this.user.email)) {
                          alert('Le format de l\'email n\'est pas valide');
                          return;
                      }
                      return this.login();
                  }
              } else {
                  this.register();
              }
            },
            login: function () {
                this.processing = true;
                messaging.getCurrentPushToken().then(token => {
                    API.login({
                        email: this.user.email,
                        password: this.user.password,
                        uuid: this.user.uuid,
                        pusherChannel: this.user.pusherChannel,
                        os: this.user.os,
                        type: this.user.type,
                        version: this.user.version,
                        pushToken: token
                    })
                        .then(res => {
                            localStorage.setItem('token', res.data.token);
                            localStorage.setItem('user', JSON.stringify(res.data.user));
                            this.processing = false;
                            this.loginComplete(res.data.user);
                        }).catch(err => {
                        alert(err.response.data.error || "Le serveur est indisponible pour le moment. Essayez plus tard.");
                        this.processing = false;
                    });
                }).catch(err => {
                    this.processing = false;
                });
            },
            register: function () {
                this.processing = true;
                messaging.getCurrentPushToken().then(token => {
                    API.register({
                        email: this.user.email,
                        password: this.user.password,
                        uuid: this.user.uuid,
                        pusherChannel: this.user.pusherChannel,
                        name: this.user.name,
                        os: this.user.os,
                        type: this.user.type,
                        version: this.user.version,
                        phoneNumber: this.user.phoneNumber,
                        pushToken: token
                    }).then(res => {
                        this.processing = false;
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                        this.loginComplete(res.data.user);
                    }).catch(err => {
                        this.processing = false;
                        alert(err.response.data.error);
                    })
                }).catch(err => {
                    this.processing = false;
                });
            },

            loginComplete: function (user) {
                this.$navigateTo(App, {
                    animated: true,
                    frame: 'mainFrame',
                    clearHistory: true,
                    transition: {
                        name: "slide",
                        duration: 150,
                        curve: "easeIn"
                    },
                    props: {
                        user: user,
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .page {
        align-items: center;
        flex-direction: column;
    }
    .form {
        margin-left: 30;
        margin-right: 30;
        flex-grow: 2;
        vertical-align: middle;
    }
    .page-layout {
        background-color: #2a10c2;
    }

    .border-bottom {
        border-bottom-width: 0;
        border-bottom-color: white;
        margin-bottom: 30;
        padding-bottom: 6;
    }

    .form-input {
        color: white;
        placeholder-color: white;
        width: 90%;
        border-width: 1 1 1 1;
        border-color: #ffffff;
        border-radius: 15;
    }

    .icon-margin {
        margin-right: 10;
    }

    .my-btn {
        background-color: #00E676;
        color: white;
        font-weight: bold;
        border-radius: 25;
        padding-top: 14;
        padding-bottom: 14;
        text-transform: uppercase;
        letter-spacing: 0.1;
        margin-bottom: 20;
        margin-top: 10;
    }

    .my-btn.disabled {
        background-color: lightgray;
    }

    .links {
        color: white;
    }
    .full-height {
        height: 100%;
    }
    .logo {
        width: 150;
        margin-bottom: 60;
    }

    .container {
        margin-right: 34;
        margin-left: 34;
        font-size: 14;
    }
</style>
