import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./main";

type UserContextType = {
    currentUser: User | null;
    loading: boolean;
    logout: ()=>Promise<void>;
    notificationDenied: boolean;
    setNotificationDenied: React.Dispatch<React.SetStateAction<boolean>>;
    homeNotification: boolean;
    setHomeNotification: React.Dispatch<React.SetStateAction<boolean>>;
    gameNotification: boolean;
    setGameNotification: React.Dispatch<React.SetStateAction<boolean>>;
    mygamesNotification: boolean;
    setMygamesNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}:{children:any}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [notificationDenied, setNotificationDenied] = useState(false);
    const [homeNotification, setHomeNotification] = useState(false);
    const [gameNotification, setGameNotification] = useState(false);
    const [mygamesNotification, setMygamesNotification] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return <>
        <UserContext.Provider value={{currentUser, loading, logout, notificationDenied, setNotificationDenied,
            homeNotification, setHomeNotification, gameNotification, setGameNotification, mygamesNotification, setMygamesNotification}}>
            {children}
        </UserContext.Provider>
    </>
}