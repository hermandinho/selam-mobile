<template>
    <Page>
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <StackLayout class="input-field">
                    <TextField hint="Email" ></TextField>
                </StackLayout>

                <StackLayout class="input-field">
                    <TextField hint="Password"></TextField>
                </StackLayout>

                <StackLayout *ngIf="!isLoggingIn" class="input-field">
                    <TextField hint="Confirm password"></TextField>
                </StackLayout>

                <Button text="Log In" ></Button>
                <Label text="Forgot your password?"></Label>
            </StackLayout>

            <Label (tap)="toggleForm()">
                <FormattedString>
                    <Span text="Don’t have an account?"></Span>
                    <Span text="Sign up" class="bold"></Span>
                </FormattedString>
            </Label>
        </FlexboxLayout>
    </Page>
</template>

<script>
    export default {
        name: "login-page"
    }
</script>

<style scoped>
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
</style>