import { useState } from "react";
import { notifyPermissionCheck, sendNotification } from "./notificationServices";

export function NotifyRequest({denied, setDenied}:{denied:boolean, setDenied:React.Dispatch<React.SetStateAction<boolean>>}) {
    const [displayRequest, setDisplayRequest] = useState(!notifyPermissionCheck());

    if(denied) return <></>

    return <>
        <div className="notify-request" style={{display:displayRequest?"flex":"none"}}>
            <span>Allow notifications to be received</span>
            <div className="notify-buttons">
                <button onClick={()=>{
                    Notification.requestPermission().then((permission) => {
                        if(permission === "granted") {
                            setDisplayRequest(false);
                            sendNotification("Notification Enabled", "VGP can now send you notifications!");
                        }
                        else {
                            setDisplayRequest(false);
                        }
                    })}}>ALLOW</button>
                <button onClick={()=>{setDisplayRequest(false); setDenied(true)}}>DENY</button>
            </div>
        </div>
    </>
}