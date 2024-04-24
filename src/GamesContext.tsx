import { createContext, useEffect, useState } from "react";
import { Game, getGameList } from "./firebaseServices";

type GamesContextType = {
    gameList: Game[];
    fourGames: Game[];
    updateFourGames: () => void;
}

export const GamesContext = createContext<GamesContextType>({
    gameList:[],
    fourGames:[],
    updateFourGames: ()=>{},
});

export const GamesProvider = ({children}:{children:any}) => {
    const [gameList, setGameList] = useState<Game[]>([]);
    const [fourGames, setFourGames] = useState<Game[]>([]);

    useEffect(() => {
        getGameList().then(gl => {
            setGameList(gl);
            let fourGamesInit = []
            for(let i=0; i<4; i++) {
                fourGamesInit.push(gl[Math.floor(Math.random() * gl.length)]);
        }
        setFourGames(fourGamesInit);
        });
    }, [])

    const updateFourGames = () => {
        fourGames.shift();
        let newFourGames = [...fourGames, gameList[Math.floor(Math.random() * gameList.length)]];
        setFourGames(newFourGames);
    }

    return <>
        <GamesContext.Provider value={{gameList, fourGames, updateFourGames}}>
            {children}
        </GamesContext.Provider>
    </>
}
