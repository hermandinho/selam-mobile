<template>
    <Frame>
        <Page @navigatedTo="onNavigatedTo">
            <ActionBar class="action-bar" title="Créer une annonce">
                <ActionItem @tap="$modal.close"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
            </ActionBar>

            <ScrollView orientation="vertical">
                <GridLayout columns="*,2*" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" width="100%" class="container p-5 m-10">
                    <ActivityIndicator row="4" :busy="loading" rowSpan="3" colSpan="2" color="#ec4980" />

                    <Label class="margin-bottom label" text="Titre" row="0" col="0" />
                    <TextView col="1" row="0" hint="Titre" v-model="article.title" class="margin-bottom form-input" autocorrect="false"/>

                    <Label class="margin-bottom label" text="Description" row="1" col="0" />
                    <TextView v-model="article.description" col="1" row="1" autocorrect="false"/>

                    <Label class="margin-bottom label" text="Catégorie" row="2" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="2" @tap="openCategoriesSelect">{{ selectedCategory }}</Button>

                    <Label class="margin-bottom label" text="Sous catégorie" row="3" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="3" @tap="openSubCategoriesSelect">{{ article.subCategory }}</Button>

                    <Label class="margin-bottom label" text="Pays" row="4" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="4" @tap="openCountriesSelect">{{ selectedCountry }}</Button>

                    <Label class="margin-bottom label" text="Ville" row="5" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="5" @tap="openRegionsSelect">{{ article.region }}</Button>

                    <Label class="margin-bottom label" text="Prix" row="6" col="0" />
                    <GridLayout row="6" col="1" columns="2*,*" rows="*" class="margin-bottom price-layout">
                        <TextField col="0" row="0" hint="Prix" v-model="article.price.amount" class="form-input" autocorrect="false" keyboardType="number"/>
                        <Button class="btn btn-outline" col="1" row="0" @tap="openCurrenciesSelect">{{ article.currency }}</Button>
                    </GridLayout>

                    <Label class="margin-bottom label" text="Images" row="7" col="0" />
                    <Button class="btn btn-outline" col="1" row="7" @tap="selectPictures">Choisir</Button>

                    <WrapLayout v-if="article.pictures.length" orientation="horizontal" row="8" col="0" colSpan="2" class="margin-bottom preview-images p-r-10" width="auto" height="auto">
                        <Image
                            :src="img"
                            stretch="aspectFill"
                            width="75"
                            height="75"
                            v-for="(img, i) in article.pictures"
                            class="img-thumbnail img-rounded"
                            @longPress="selectedImage(img)"
                        />
                    </WrapLayout>

                    <Label class="margin-bottom label" text="Prix fixe" row="9" col="0" />
                    <Switch class="fixed-price-switch" v-model="article.price.fixed"  col="1" row="9"/>

                    <Label class="margin-bottom label" text="Echange possible" row="10" col="0" />
                    <Switch class="fixed-price-switch" v-model="article.exchange"  col="1" row="10"/>

                    <Button @tap="submit" row="11" colSpan="2" :text="busy ? 'En cours ... ' : 'Publier'" class="btn btn-primary" :isEnabled="!busy"/>
                </GridLayout>
            </ScrollView>

        </Page>
    </Frame>
</template>

<script>
    /*'data:Image/png;base64,' + */
    const imagepicker = require("nativescript-imagepicker");
    var bghttp = require("nativescript-background-http");
    import { fromAsset, fromBase64 } from "tns-core-modules/image-source";
    import API from '../../api'
    const Toast = require('nativescript-toast');

    const CHOOSE_LABEL = 'Choisir';
    const CLOSE_LABEL = 'Fermer';

    export default {
        name: "add-article-modal",
        data: function () {
            return {
                article: {
                    title: 'Test',
                    description: 'La description de mon article.',
                    price: {
                        amount: '0.0',
                        fixed: true
                    },
                    currency: 'CFA',
                    exchange: true,
                    user: null,
                    region: 'Choisir',
                    subCategory: 'Choisir',
                    published: true,
                    available: true,
                    pictures: [],
                },
                busy: false,
                loading: false,
                selectedCategory: CHOOSE_LABEL,
                selectedCountry: CHOOSE_LABEL,
                filters: {
                    countries: [],
                    towns: [],
                    townsActions: [],
                    categories: [],
                    subCategories: [],
                    subCategoriesActions: [],
                    currenciesActions: []
                }
            }
        },
        watch: {
            selectedCategory: function (n, o) {
                if (n === CHOOSE_LABEL) {
                    this.filters.subCategoriesActions = [];
                    this.article.subCategory = CHOOSE_LABEL;
                } else {
                    let actions = [];
                    this.filters.subCategories.map(s => {
                        if (s.category.name === n) {
                            actions.push(s.name);
                        }
                    });
                    this.filters.subCategoriesActions = actions;
                    this.article.subCategory = this.filters.subCategoriesActions[0] || CHOOSE_LABEL;
                }
            },
            selectedCountry: function (n) {
                if (n === CHOOSE_LABEL) {
                    this.article.region = CHOOSE_LABEL;
                    this.filters.townsActions = [];
                } else {
                    let actions = [];
                    this.filters.currenciesActions = [];
                    this.filters.countries.map(c => {
                        if (c.name === n && this.filters.currenciesActions.indexOf(c.currency) === -1) {
                            this.filters.currenciesActions.push(c.currency);
                        }
                    });

                    this.filters.towns.map(s => {
                        if (s.country.name === n) {
                            actions.push(s.name);
                        }
                    });
                    this.filters.townsActions = actions;
                    this.article.region = this.filters.townsActions[0] || CHOOSE_LABEL;
                    this.article.currency = this.filters.currenciesActions[0] || CHOOSE_LABEL;
                }
            }
        },
        methods: {
            openCurrenciesSelect: function () {
                action("Sélectionnez une monaie", CLOSE_LABEL, this.filters.currenciesActions)
                .then(result => {
                    if (result !== CLOSE_LABEL)
                        this.selectedCategory = result;
                });
            },
            openCategoriesSelect: function () {
                let actions = [];
                this.filters.categories.map(c => {
                    actions.push(c.name);
                });
                action("Sélectionnez une catégorie", CLOSE_LABEL, actions)
                .then(result => {
                    if (result !== CLOSE_LABEL)
                        this.selectedCategory = result;
                });
            },
            openSubCategoriesSelect: function () {
                if (!this.filters.categories.length || this.selectedCategory === CHOOSE_LABEL) {
                    return;
                }
                action("Sélectionnez une sous-catégorie", CLOSE_LABEL, this.filters.subCategoriesActions)
                .then(result => {
                    if (result !== CLOSE_LABEL)
                        this.article.subCategory = result;
                });
            },
            openCountriesSelect: function () {
                let actions = [];
                this.filters.countries.map(c => {
                    actions.push(c.name);
                });
                action("Sélectionnez votre pays", CLOSE_LABEL, actions)
                    .then(result => {
                        if (result !== CLOSE_LABEL)
                            this.selectedCountry = result;
                    });
            },
            openRegionsSelect: function () {
                if (!this.filters.countries.length || this.selectedCountry === CHOOSE_LABEL) {
                    return;
                }
                action("Sélectionnez une région", CLOSE_LABEL, this.filters.townsActions)
                    .then(result => {
                        if (result !== CLOSE_LABEL)
                            this.article.region = result;
                    });
            },
            selectPictures: function () {
                const context = imagepicker.create({ mode: "multiple", mediaType: 1 }); // use "multiple" for multiple selection, or single for single selection
                context
                    .authorize()
                    .then(function() {
                        return context.present();
                    })
                    .then((selection) => {
                        this.article.pictures = [];
                        selection.forEach((selected) => {
                            this.article.pictures.push(selected.android);
                            // this.article.pictures.push(src.toBase64String("png").toString());
                            /*fromAsset(selected).then(src => {
                            });*/
                        });
                        // list.items = selection;
                    }).catch(function (e) {
                    // process error

                });
            },
            selectedImage: function (img) {
                confirm('Voullez vous suprimmer cette image?').then(res => {
                    if (res) {
                        this.article.pictures.splice(this.article.pictures.indexOf(img), 1);
                    }
                });
            },
            validate: function (params) {
                params.title = params.title.trim();
                params.description = params.description.trim();

                if (!params.title || !params.title.length) {
                    alert('Veillez saisir un titre pour votre publication.');
                    return false;
                }
                if (!params.subCategory || params.subCategory === CHOOSE_LABEL) {
                    alert('Veillez selectionner une sous catégorie.');
                    return false;
                }
                if (!params.region || params.region === CHOOSE_LABEL) {
                    alert('Veillez selectionner une ville.');
                    return false;
                }
                if (!params.user) {
                    alert('Impossible de publier votre article. Vous devez être connecté.');
                    return false;
                }
                return true;
            },
            submit: function () {
                this.busy = true;
                let params = JSON.parse(JSON.stringify(this.article));
                let user = JSON.parse(localStorage.getItem('user'));
                params.subCategory = this.filters.subCategories.filter(s => s.name.trim().toLowerCase() === params.subCategory.trim().toLowerCase())[0];
                params.subCategory = params.subCategory && params.subCategory._id || null;
                params.region = this.filters.towns.filter(t => t.name.trim().toLowerCase() === params.region.trim().toLowerCase())[0];
                params.region = params.region && params.region._id || null;
                params.user = user && user._id || null;
                const images = params.pictures || [];
                // params.pictures = images.length > 0 ? ['*'] : [];

                if (this.validate(params)) {
                    API.createArticle(params).then(res => {
                        Toast.makeText("Votre annonce est en cours de publication...", 'long').show();
                        this.busy = false;
                        if (images.length > 0) {
                            this.uploadImages(res.data._id, images);
                        } else {
                            this.$modal.close();
                        }
                    }).catch(err => {
                        this.busy = false;
                        alert(err.response.data.error || "Le serveur est indisponible pour le moment. Essayez plus tard.");
                    });
                } else {
                    this.busy = false;
                }
            },
            uploadImages: function (id, images) {
                const session = bghttp.session("image-upload");
                const request = {
                    url: API.getAPIBaseURL() + '/article/' + id + '/upload',
                    method: "POST",
                    headers: {
                        //"Content-Type": "application/octet-stream",
                        "Authorization": "Bearer " + localStorage.getItem('token'),
                        'File-Name': 'name',
                    },
                    // utf8: true,
                    description: "Uploading article images",
                    androidDisplayNotificationProgress: true,
                    androidNotificationTitle: 'Publication de l\'annonce en cours .....',
                    androidMaxRetries: 5
                };
                let params;
                let count = 0;
                images.map((img)=> {
                    params = [
                        { name: "name", value: 'article-' + id + '-' + (count ++) },
                        { name: "fileToUpload", filename: img, mimeType: "image/jpeg" }
                    ];
                    const task = session.multipartUpload(params, request);
                    task.on("complete", (res) => {
                        //console.log('UPLOAD COMPLETE: ', res);
                        //this.$modal.close();
                        //Toast.makeText(count + ' uploaded', 'medium').show();
                        if (count >= images.length) {
                            Toast.makeText('Votre annonce a été publié avec succès !!', 'long').show();
                        }
                    });
                    task.on("error", (err) => {
                        //console.log("UPLOAD ERROR: ", err);
                        // Toast.makeText('ERROR', 'long').show();
                        if (count >= images.length) {
                            Toast.makeText('Certains images de votre annonce n\'ont pas pu être envoyé sur nos serveurs.', 'long').show();
                        }
                    });
                    task.on("progress", (res) => {
                    });
                    task.on("responded", (res) => {
                    });
                    task.on("cancelled", (res) => {
                    }); // Android only

                    this.$modal.close();

                })
            },
            onNavigatedTo: function () {
                this.loading = true;
                API.fetchConfigFilters().then(res => {
                   this.loading = false;
                   const data = res.data;
                   this.filters.countries = data.countries || [];
                   this.filters.towns = data.towns || [];
                   this.filters.categories = data.categories || [];
                   this.filters.subCategories = data.subCategories || [];
                }).catch(err => {
                    this.loading = false;
                    alert('Une erreur est survenue.').then(res => {
                        this.$modal.close();
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .container {

    }

    .label {
        text-align: right;
        horizontal-align: center;
        vertical-align: center;
        font-size: 14;
    }
    .margin-bottom {
        margin-bottom: 15;
    }

    .preview-images {
        margin-right: 15;
        margin-left: 15;
        margin-top: 15;
    }

    .preview-images .img-thumbnail {
        margin-right: 1;
        margin-left: 1;
        margin-bottom: 1;
    }
</style>
