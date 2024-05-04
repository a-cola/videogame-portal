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

export function sendNotification(title:string, body:string) {
    if(notifyPermissionCheck()) {
        new Notification(title, {
            lang:"en",
            body:body,
            icon:"VGP_Logo_Small.png",
        })
    }
    else {
        console.error("Notification permission: denied");
    }
}