import { useState } from "react";

export function NotifyRequest() {
    const [permission, setPermission] = useState(notifyPermissionCheck());
    
    function notifyPermissionCheck() {
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

    return <>
        <div className="notify-request" style={{display:permission?"none":"flex"}}>
            <span>Allow notifications to be received</span>
            <div className="notify-buttons">
                <button onClick={()=>{
                    Notification.requestPermission().then((permission) => {
                        if(permission === "granted") {
                            setPermission(true);
                            new Notification("Notifiche abilitate");
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