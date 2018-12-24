// import { AD_SIZE, createBanner, hideBanner, preloadInterstitial, showInterstitial, createInterstitial } from "nativescript-admob";
import firebase from 'nativescript-plugin-firebase';
import { LocalNotifications } from "nativescript-local-notifications";

const testing = false;

LocalNotifications.addOnMessageReceivedCallback(notificationData => {
    console.log("Notification received: " + JSON.stringify(notificationData));
});

let sentLocalNotification = (data) => {
    LocalNotifications.hasPermission().then(res => {
        LocalNotifications.schedule(
            [{
                id: data.from,
                title: data.title,
                // subtitle: 'test',
                image: "res://icon",
                thumbnail: true,
                body: data.body,
                at: new Date(new Date().getTime() + 10),
                // badge: 3
            }])
            .then(() => {
                /*alert({
                    title: "Notification scheduled",
                    message: 'ID: 3',
                    okButtonText: "OK, thanks"
                });*/
            })
            .catch(error => console.log("doScheduleAndSetBadgeNumber error: " + error));
    })
};

let createInterstitialAdd = () => {
    firebase.admob.preloadInterstitial({
        //iosInterstitialId: "ca-app-pub-9517346003011652/6938836122",
        androidInterstitialId: "ca-app-pub-4088662990526474/5815485613",
        testing: testing, // when not running in production set this to true, Google doesn't like it any other way
        /*iosTestDeviceIds: [ // Android automatically adds the connected device as test device with testing:true, iOS does not
            "45d77bf513dfabc2949ba053da83c0c7b7e87715", // Eddy's iPhone 6s
            "fee4cf319a242eab4701543e4c16db89c722731f"  // Eddy's iPad Pro
        ],*/
        onAdClosed: () => console.log("Interstitial closed")
    }).then(
        function () {
            console.log("AdMob interstitial preloaded, you can now call 'showInterstitial' at any time to show it without delay.");
            firebase.admob.showInterstitial().then(
                function () {
                    console.log("AdMob interstitial showing.");
                },
                function (errorMessage) {
                    console.log("Error showing Interstitial add", errorMessage)
                }
            );
        },
        function (errorMessage) {
            console.log("Error preloadInterstitial add", errorMessage)
        }
    );
};

let createAddBanner = () => {
    setTimeout(() => {
        firebase.admob.showBanner({
            // if this 'view' property is not set, the banner is overlayed on the current top most view
            // view: ..,
            testing: testing,
            size: firebase.admob.AD_SIZE.SMART_BANNER,
            //iosBannerId: "ca-app-pub-9517346003011652/3985369721",
            androidBannerId: testing
                ? "ca-app-pub-3940256099942544/6300978111"  // global test banner id
                : "ca-app-pub-4088662990526474/4824724185", // our registered banner id
            // Android automatically adds the connected device as test device with testing:true, iOS does not
            // iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
            margins: {
                // if both are set, top wins
                // top: 10
                //bottom: isIOS ? 50 : 0
                bottom: 0
            },
            keywords: []
        }).then((res) => console.log('Banner created '),
            error => console.log("Error creating banner: " , error)
        )
    },100);
};

export default {
    createAddBanner,
    createInterstitialAdd,
    sentLocalNotification
}
