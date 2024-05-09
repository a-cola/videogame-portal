export function notifyPermissionCheck() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        return true;
    }
    else if (Notification.permission === "denied") {
        return false;
    }
}

// If user has give permission to send notifications then the notification will be sent otherwise an error will be printed
export function sendNotification(title:string, body:string) {
    if(notifyPermissionCheck()) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
                lang:"en",
                body:body,
                icon:"VGP_Logo_Small.png",
            })
        })
    }
    else {
        console.error("Notification permission: denied");
    }
}