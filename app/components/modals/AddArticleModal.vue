<template>
    <Frame>
        <Page>
            <ActionBar class="action-bar" title="Créer une annonce">
                <ActionItem @tap="$modal.close"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_close_clear_cancel" android.position="actionBar"/>
                <!--<ActionItem @tap="$modal.close"
                            ios.systemIcon="9" ios.position="left"
                            android.systemIcon="ic_menu_add" android.position="actionBar"/>-->
            </ActionBar>

            <ScrollView orientation="vertical">
                <GridLayout columns="*,2*" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" width="100%" class="container p-10 m-20">
                    <Label class="margin-bottom label" text="Titre" row="0" col="0" />
                    <TextField col="1" row="0" hint="Titre" v-model="article.name" class="margin-bottom form-input" autocorrect="false"/>

                    <Label class="margin-bottom label" text="Catégorie" row="1" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="1" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Sous catégorie" row="2" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="2" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Pays" row="3" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="3" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Ville" row="4" col="0" />
                    <Button class="margin-bottom btn btn-outline" col="1" row="4" @tap="openCategorisSelect">{{ article.category }}</Button>

                    <Label class="margin-bottom label" text="Prix" row="5" col="0" />
                    <GridLayout row="5" col="1" columns="2*,*" rows="*" class="margin-bottom price-layout">
                        <TextField col="0" row="0" hint="Prix" v-model="article.price" class="form-input" autocorrect="false" keyboardType="number"/>
                        <Button class="btn btn-outline" col="1" row="0" @tap="openCategorisSelect">{{ article.currency }}</Button>
                    </GridLayout>
                </GridLayout>
            </ScrollView>

        </Page>
    </Frame>
</template>

<script>
    export default {
        name: "add-article-modal",
        data: function () {
            return {
                article: {
                    name: '',
                    price: '',
                    currency: 'CFA',
                    category: 'Choisir'
                }
            }
        },
        methods: {
            openCategorisSelect: function () {
                action("Your message", "Annuler", ["Option1", "Option2"])
                .then(result => {
                    this.article.category = result;
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
        font-weight: bold;
    }
    .margin-bottom {
        margin-bottom: 15;
    }
</style>