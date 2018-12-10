<template>
    <Frame>
        <Page>
            <ActionBar class="action-bar" title="Créer une annonce">
                <ActionItem @tap="$modal.close"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
            </ActionBar>

            <ScrollView orientation="vertical">
                <GridLayout columns="*,2*" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" width="100%" class="container p-5 m-10">
                    <Label class="margin-bottom label" text="Titre" row="0" col="0" />
                    <TextView col="1" row="0" hint="Titre" v-model="article.name" class="margin-bottom form-input" autocorrect="false"/>

                    <Label class="margin-bottom label" text="Description" row="1" col="0" />
                    <TextView v-model="article.description" col="1" row="1" autocorrect="false"/>

                    <Label class="margin-bottom label" text="Catégorie" row="2" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="2" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Sous catégorie" row="3" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="3" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Pays" row="4" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="4" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Ville" row="5" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="5" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Prix" row="6" col="0" />
                    <GridLayout row="6" col="1" columns="2*,*" rows="*" class="margin-bottom price-layout">
                        <TextField col="0" row="0" hint="Prix" v-model="article.price" class="form-input" autocorrect="false" keyboardType="number"/>
                        <Button class="btn btn-outline" col="1" row="0" @tap="openCategorisSelect">{{ article.currency }}</Button>
                    </GridLayout>

                    <Label class="margin-bottom label" text="Images" row="7" col="0" />
                    <Button class="btn btn-outline" col="1" row="7" @tap="selectPictures">Choisir</Button>

                    <WrapLayout v-if="article.images.length" orientation="horizontal" row="8" col="0" colSpan="2" class="margin-bottom preview-images p-r-10" width="auto" height="auto">
                        <Image
                            :src="'data:Image/png;base64,' + img"
                            stretch="aspectFill"
                            width="75"
                            height="75"
                            v-for="(img, i) in article.images"
                            class="img-thumbnail img-rounded"
                            @longPress="selectedImage(img)"
                        />
                    </WrapLayout>

                    <Label class="margin-bottom label" text="Prix fixe" row="9" col="0" />
                    <Switch class="fixed-price-switch" v-model="article.fixedPrice"  col="1" row="9"/>

                    <Label class="margin-bottom label" text="Echange possible" row="10" col="0" />
                    <Switch class="fixed-price-switch" v-model="article.accecpExchange"  col="1" row="10"/>

                    <Button @tap="submit" row="11" colSpan="2" :text="busy ? 'En cours ... ' : 'Publier'" class="btn btn-primary" :isEnabled="!busy"/>
                </GridLayout>
            </ScrollView>

        </Page>
    </Frame>
</template>

<script>
    const imagepicker = require("nativescript-imagepicker");
    import { fromAsset, fromBase64 } from "tns-core-modules/image-source";

    export default {
        name: "add-article-modal",
        data: function () {
            return {
                article: {
                    title: '',
                    description: 'La description de mon article.',
                    price: '',
                    currency: 'CFA',
                    category: 'Choisir',
                    images: [],
                    fixedPrice: false,
                    accecpExchange: false
                },
                busy: false
            }
        },
        methods: {
            openCategorisSelect: function () {
                action("Your message", "Annuler", ["Option1", "Option2"])
                .then(result => {
                    this.article.category = result;
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
                        this.article.images = [];
                        selection.forEach((selected) => {
                            fromAsset(selected).then(src => {
                                this.article.images.push(src.toBase64String("png").toString());
                            });
                        });
                        // list.items = selection;
                    }).catch(function (e) {
                    // process error

                });
            },
            selectedImage: function (img) {
                confirm('Voullez vous suprimmer cette image?').then(res => {
                    if (res) {
                        this.article.images.splice(this.article.images.indexOf(img), 1);
                    }
                });
            },
            submit: function () {
                this.busy = true;
                setTimeout(() => {
                    this.busy = false;
                }, 5000)
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
        font-weight: bold;
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
