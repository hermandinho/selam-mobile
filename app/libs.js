import { AD_SIZE, createBanner, hideBanner } from "nativescript-admob";
import { LocalNotifications } from "nativescript-local-notifications";

LocalNotifications.addOnMessageReceivedCallback(notificationData => {
    console.log("Notification received: " + JSON.stringify(notificationData));
});

let sentLocalNotification = (data) => {

    /*LocalNotifications.hasPermission().then(res => {
        LocalNotifications.schedule(
            [{
                id: 3,
                title: 'Hi',
                subtitle: 'test',
                image: "res://icon",
                thumbnail: false,
                body: 'You should see a \'3\' somewhere',
                at: new Date(new Date().getTime() + 10 * 1000),
                badge: 3
            }])
            .then(() => {
                alert({
                    title: "Notification scheduled",
                    message: 'ID: 3',
                    okButtonText: "OK, thanks"
                });
            })
            .catch(error => console.log("doScheduleAndSetBadgeNumber error: " + error));
    })*/
};

let createAddBanner = () => {
    const testing = true;
    createBanner({
        // if this 'view' property is not set, the banner is overlayed on the current top most view
        // view: ..,
        size: AD_SIZE.SMART_BANNER,
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
            bottom: 2
        },
        keywords: ["football", "phones", "cars", "house", "fashion", "computer", "technology"]
    }).then((res) => console.log('Banner created ', res),
        error => console.log("Error creating banner: " , error)
    )
};

export default {
    createAddBanner,
    sentLocalNotification
}
