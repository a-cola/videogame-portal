import { useState } from "react";
import { notifyPermissionCheck, sendNotification } from "./notificationServices";

export function NotifyRequest() {
    const [permission, setPermission] = useState(notifyPermissionCheck());

    return <>
        <div className="notify-request" style={{display:permission?"none":"flex"}}>
            <span>Allow notifications to be received</span>
            <div className="notify-buttons">
                <button onClick={()=>{
                    Notification.requestPermission().then((permission) => {
                        if(permission === "granted") {
                            setPermission(true);
                            sendNotification("Notification Enabled", "VGP can now send you notification!");
                        }
                        else
                            setPermission(false);
                    })
                    }}>ALLOW</button>
                <button onClick={()=>setPermission(false)}>DENY</button>
            </div>
        </div>
    </>
    
}