<template>
    <Page verticalAlignment="top" class="page">
        <ActionBar class="action-bar" color="#ffffff">
            <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
            <Label class="action-bar-title" text="Title"></Label>
        </ActionBar>

        <ScrollView orientation="vertical" >
            <GridLayout columns="2*,*" rows="auto,auto,auto,auto,auto,auto,auto" width="100%" class="container m-10">
                <Label class="label title" text="Iphone 5S en bonne état a vendre a un bon prix." textWrap="true" width="auto" col="0" row="0"/>
                <Label class="label price text-right" text="120 000 CFA" width="auto" col="1" row="0"/>

                <Image src="res://ic_no_image" width="auto" stretch="aspectFit" height="180" class="main-image m-t-15" col="0" row="1" colSpan="2"/>

                <ScrollView orientation="horizontal" col="0" row="2" colSpan="2" class="image-thumbnails">
                    <GridLayout rows="auto" columns="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto">
                        <Image
                            @tap="activeImageIndex = i"
                            src="res://ic_no_image"
                            stretch="aspectFit"
                            width="65" height="65"
                            class="preview-image"
                            :class="i === activeImageIndex ? 'active': ''"
                            :col="i" row="0"
                            v-for="(img, i) in [1,2,3,4]"/>
                    </GridLayout>
                </ScrollView>

                <TextView editable="false" col="0" row="3" colSpan="2" class="description">
                    <FormattedString>
                        <Span text="Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."/>
                    </FormattedString>
                </TextView>

                <TextView editable="false" row="4" col="0" colSpan="2" class="no-border-bottom contact-info-zone" borderBottomWidth="0" borderColor="green">
                    <FormattedString>
                        <Span text="Publié le: " class="bold-label" fontWeight="Bold"/>
                        <Span text="20/12/2018"  fontWeight="Italic"/>
                    </FormattedString>
                </TextView>

                <TextView editable="false" row="5" col="0" colSpan="2" class="no-border-bottom" borderBottomWidth="0">
                    <FormattedString>
                        <Span text="Par: " class="bold-label" fontWeight="Bold"/>
                        <Span text="El manifico" fontWeight="Italic" />
                    </FormattedString>
                </TextView>

                <FlexboxLayout justifyContent="space-around" alignItems="center" flexDirection="columns" row="6" col="0" colSpan="2" class="contact-zone" backgroundColor="lightgray">
                    <Image src="res://email_primary" stretch="aspectFit" width="75" height="75" class="contact-icon" alignSelf="center"/>
                    <Image src="res://email_primary" stretch="aspectFit" width="75" height="75" class="contact-icon" alignSelf="center"/>
                    <Image src="res://email_primary" stretch="aspectFit" width="75" height="75" class="contact-icon" alignSelf="center"/>
                </FlexboxLayout>

            </GridLayout>
        </ScrollView>
    </Page>

</template>

<script>
    export default {
        name: "article-detail-page",
        data: function () {
            return {
                activeImageIndex: 0
            }
        },
        components: {
        },
        methods: {}
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
        font-size: 15;
    }

    .bold-label {
        font-weight: 14;
    }

    .contact-info-zone {
        margin-top: 20;
    }
</style>
