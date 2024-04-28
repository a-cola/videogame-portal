import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./main";

type UserContextType = {
    currentUser: User | null;
    loading: boolean;
    logout: ()=>Promise<void>;
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

    const logout = async () => {
        await signOut(auth);
    }

    return <>
        <UserContext.Provider value={{currentUser, loading, logout}}>
            {children}
        </UserContext.Provider>
    </>
}