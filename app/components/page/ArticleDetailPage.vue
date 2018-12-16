<template>
    <Page verticalAlignment="top" class="page" @navigatedTo="onNavigatedTo">
        <ActionBar class="action-bar" color="#ffffff">
            <NavigationButton @tap="$navigateBack({ frame: 'articlesFrame' })" android.systemIcon="ic_menu_back" />
            <Label class="action-bar-title" :text="getArticle.title"></Label>
            <ActionItem v-show="isMyArticle"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_edit" android.position="actionBar"/>
            <ActionItem v-show="isMyArticle"
                        ios.systemIcon="9" ios.position="left"
                        android.systemIcon="ic_menu_delete" android.position="actionBar"/>
        </ActionBar>

        <ScrollView orientation="vertical" >
            <GridLayout columns="2*,*" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" width="100%" class="container m-10">
                <Label class="label title" :text="getArticle.title" textWrap="true" width="auto" col="0" row="0"/>
                <Label class="label price text-right" :text="getArticle.price.amount | currency(getArticle.currency || 'CFA')" width="auto" col="1" row="0"/>

                <Image :src="getArticle.pictures[activeImageIndex] || 'res://ic_no_image'"
                       width="auto" :stretch="getArticle.pictures[activeImageIndex] !== 'res://ic_no_image' ? 'aspectFill' : 'aspectFit'"
                       height="180" class="main-image m-t-15" col="0" row="1" colSpan="2"/>

                <ScrollView orientation="horizontal" col="0" row="2" colSpan="2" class="image-thumbnails">
                    <GridLayout rows="auto" columns="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto">
                        <Image
                            @tap="activeImageIndex = i"
                            :src="getArticle.pictures[i] || 'res://ic_no_image'"
                            stretch="aspectFill"
                            width="65" height="65"
                            class="preview-image"
                            :class="i === activeImageIndex ? 'active': ''"
                            :col="i" row="0"
                            v-for="(img, i) in getArticle.pictures"/>
                    </GridLayout>
                </ScrollView>

                <TextView editable="false" col="0" row="3" colSpan="2" class="description">
                    <FormattedString>
                        <Span :text="getArticle.description"/>
                    </FormattedString>
                </TextView>

                <Label row="4" col="0" colSpan="2" class="no-border-bottom contact-info-zone">
                    <FormattedString>
                        <Span text="Publié le: " class="bold-label" fontWeight="Bold"/>
                        <Span :text="getArticle.updated_at | toDate"  fontWeight="Italic"/>
                    </FormattedString>
                </Label>

                <Label row="5" col="0" colSpan="2" class="no-border-bottom">
                    <FormattedString>
                        <Span text="Par: " class="bold-label" fontWeight="Bold"/>
                        <Span :text="getArticle.user.name || 'N/A'" fontWeight="Italic" />
                    </FormattedString>
                </Label>

                <Label row="6" col="0" colSpan="2" class="no-border-bottom" v-if="getArticle.region">
                    <FormattedString>
                        <Span text="Disponible a : " class="bold-label" fontWeight="Bold"/>
                        <Span :text="getArticle.region && getArticle.region.country ? (getArticle.region.country.name + ' / ' + getArticle.region.name): '--'" fontWeight="Italic" />
                    </FormattedString>
                </Label>

                <Label row="7" col="0" colSpan="2" class="no-border-bottom" v-if="getArticle.subCategory">
                    <FormattedString>
                        <Span text="Catégorie : " class="bold-label" fontWeight="Bold"/>
                        <Span :text="getArticle.subCategory && getArticle.subCategory.category ? (getArticle.subCategory.category.name + ' / ' + getArticle.subCategory.name) : '--'" fontWeight="Italic" />
                    </FormattedString>
                </Label>

                <Label text="OPTIONS" row="8" col="0" colSpan="2" class="label options"/>
                <GridLayout columns="auto,auto" rows="auto,auto" row="9" colSpan="2" col="0" width="100%">
                    <Label text="Prix négociable" class=" option-label" row="0" col="0" width="50%"/>
                    <Label :text="getArticle.price.fixed ? 'Non' : 'Oui'" row="0" col="1"  width="50%" class="option-value"/>

                    <Label text="Echange possible" class=" option-label" row="1" col="0" width="50%"/>
                    <Label :text="getArticle.exchange ? 'Oui' : 'Non'" row="1" col="1"  width="50%" class="option-value"/>
                </GridLayout>

                <FlexboxLayout v-if="!isMyArticle" justifyContent="space-around" alignItems="center" flexDirection="columns" row="10" col="0" colSpan="2" class="contact-zone" backgroundColor="lightgray">
                    <Image v-if="getArticle.user && getArticle.user.acceptEmails"src="res://ic_email" stretch="aspectFill" width="70" height="70" class="contact-icon" alignSelf="center"/>
                    <Image v-if="getArticle.user && getArticle.user.acceptChats" @tap="goToChat(getArticle.user)" src="res://ic_speech_bubble" stretch="aspectFit" width="70" height="70" class="contact-icon" alignSelf="center"/>
                    <Image v-if="getArticle.user && getArticle.user.acceptPhone && getArticle.user.phoneNumber" @tap="dialPhoneNumber(getArticle.user.phoneNumber)" src="res://ic_phone_contact" stretch="aspectFit" width="70" height="70" class="contact-icon" alignSelf="center"/>
                    <Image v-if="getArticle.user && getArticle.user.acceptSMS && getArticle.user.phoneNumber" @tap="sendSMS(getArticle.user.phoneNumber)" src="res://ic_sms" stretch="aspectFit" width="70" height="70" class="contact-icon" alignSelf="center"/>
                </FlexboxLayout>

            </GridLayout>
        </ScrollView>
    </Page>

</template>

<script>
    import Vuex from 'vuex';
    const phoneManager = require( "nativescript-phone" );
    import ChatPageModal from '../modals/ChatPageModal'
    import API from '../../api'
    export default {
        props: {
            article: {
                required: true,
                type: Object
            }
        },
        name: "article-detail-page",
        data: function () {
            return {
                activeImageIndex: 0,
                loading: false,
                freshArticle: null,
            }
        },
        components: {
            ChatPageModal
        },
        computed: {
            getArticle: function () {
                return this.freshArticle || this.article || null;
            },
            isMyArticle: function () {
                let localUser = localStorage.getItem('user');
                if (localUser) {
                    localUser = JSON.parse(localUser);
                }
                return localUser._id === (this.getArticle && this.getArticle.user && this.getArticle.user._id);
            }
        },
        methods: {
            ...Vuex.mapActions(['setCurrentConversationId']),
            onNavigatedTo: function () {
                this.fetchData();
            },
            fetchData: function () {
                this.loading = true;
                if (!this.article) {
                    alert('Impossible de charger ce contenu.').then(res => {
                        this.$navigateBack();
                    });
                    return;
                }
                API.findArticle(this.article._id).then(res => {
                    this.loading = false;
                    this.freshArticle = res.data;
                }).catch(err => {
                    this.loading = false;
                })
            },
            dialPhoneNumber: function (number) {
                confirm("Vous allez effectuer une appel téléphonique au numéro " + number + ". Voulez vous continuer?").then(res => {
                    if (res) {
                        phoneManager.requestCallPermission("Veuillez autoriser cette application à ouvrir composer les numéros de téléphone.").then(res => {
                            phoneManager.dial(number, false);
                        }).catch(err => {
                            phoneManager.dial(number, true);
                        });
                    }
                });
            },
            sendSMS: function (number) {
                confirm("Vous allez envoyer un SMS au numéro " + number + ". Voulez vous continuer?").then(res => {
                    if (res) {
                        const message = `Salut ${this.getArticle.user.name}, je suis interessé par l'article: '${this.getArticle.title}' que vous avez publié sur l'app Selam Mobile.`;
                        phoneManager.sms([number], message).then(res => {}).catch(err => {});
                    }
                });
            },
            goToChat: function (user) {
                return this.$showModal(ChatPageModal, {
                    animated: true,
                    fullscreen: false,
                    /*transition: {
                        name: "slide",
                        duration: 250,
                        curve: "easeIn"
                    },*/
                    props: {
                        user,
                        text: `Salut ${this.getArticle.user.name}, je suis interessé par l'article: '${this.getArticle.title}' que vous avez publié sur l'app Selam Mobile.`,
                        fromFrame: 'articlesFrame',
                    }
                }).then(res => {
                    this.setCurrentConversationId(null);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        padding: 10;
    }
    .preview-image {
        margin: 5;
        padding: 5;
    }

    .label {
        font-size: 15;
        font-weight: bold;
        color: #000;
    }

    .title {
        padding-left: 10;
    }

    .preview-image.active {
        border-width: 3;
        border-color: #ec4980;
    }

    .main-image {
        margin-top: 15;
        border-width: 0.5;
    }

    .image-thumbnails {
        margin-top: 10;
        margin-bottom: 10;
    }
    .description {
        font-size: 16;
    }

    .bold-label {
        font-weight: 14;
    }

    .contact-info-zone {
        margin-top: 20;
    }
    .options {
        margin-top: 25;
        margin-bottom: 10;
    }
    .option-label, .option-value {
        margin-bottom: 3;
        padding: 8;
    }
    .option-label {
        background-color: lightgray;
        font-weight: bold;
        font-size: 15;
    }
    .option-value {
        text-align: center;
    }
    .contact-zone {
        margin-top: 35;
    }
</style>
