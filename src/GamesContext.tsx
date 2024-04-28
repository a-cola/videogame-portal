import { createContext, useEffect, useState } from "react";
import { Game, getGameList, getRecentlyAdded, getTopTen } from "./firebaseServices";

type GamesContextType = {
    gameList: Game[];
    fourGames: Game[];
    topTen: Game[];
    recentlyAdded: Game[];
    updateFourGames: () => void;
}

export const GamesContext = createContext<GamesContextType>({
    gameList:[],
    fourGames:[],
    topTen:[],
    recentlyAdded:[],
    updateFourGames: ()=>{},
});

export const GamesProvider = ({children}:{children:any}) => {
    const [gameList, setGameList] = useState<Game[]>([]);
    const [fourGames, setFourGames] = useState<Game[]>([]);
    const [topTen, setTopTen] = useState<Game[]>([]);
    const [recentlyAdded, setRecentlyAdded] = useState<Game[]>([]);


    useEffect(() => {
        getGameList().then(gl => {
            setGameList(gl);
            let fourGamesInit = []
            for(let i=0; i<4; i++) {
                fourGamesInit.push(gl[Math.floor(Math.random() * gl.length)]);
        }
        getTopTen().then(tt => setTopTen(tt));
        getRecentlyAdded().then(ra => setRecentlyAdded(ra));
        setFourGames(fourGamesInit);
        });
    }, [])

    const updateFourGames = () => {
        setFourGames((prevFourGames) => {
            const newFourGames = [...prevFourGames];
            newFourGames.shift();
            newFourGames.push(gameList[Math.floor(Math.random() * gameList.length)]);
            return newFourGames;
        });
    }

    return <>
        <GamesContext.Provider value={{gameList, fourGames, topTen, recentlyAdded, updateFourGames}}>
            {children}
        </GamesContext.Provider>
    </>
}
