import { createContext, useEffect, useState } from "react";
import { Game, getGameList } from "./firebaseServices";

type GamesContextType = {
    gameList: Game[];
}

export const GamesContext = createContext<GamesContextType>({
    gameList:[],
});

export const GamesProvider = ({children}:{children:any}) => {
    const [gameList, setGameList] = useState<Game[]>([]);

    useEffect(() => {
        getGameList().then(gl => setGameList(gl))
    }, [])

    return <>
        <GamesContext.Provider value={{gameList}}>
            {children}
        </GamesContext.Provider>
    </>
}
