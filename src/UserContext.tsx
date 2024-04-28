import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./main";

type UserContextType = {
    currentUser: User | null;
    loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({children}:{children:any}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);

    return <>
        <UserContext.Provider value={{currentUser, loading}}>
            {children}
        </UserContext.Provider>
    </>
}