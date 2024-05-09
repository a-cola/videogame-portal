import { createContext, useEffect, useState } from "react";
import { Game, getGameList, getRecentlyAdded, getTopTen } from "./firebaseServices";

type GamesContextType = {
    loading: boolean;
    gameList: Game[];
    fourGames: Game[];
    topTen: Game[];
    recentlyAdded: Game[];
    updateFourGames: () => void;
    searchGames: (searchText:string, limit:number) => Game[]
}

export const GamesContext = createContext<GamesContextType>({
    loading:true,
    gameList:[],
    fourGames:[],
    topTen:[],
    recentlyAdded:[],
    updateFourGames: ()=>{},
    searchGames: ()=>({} as Game[]),
});

export const GamesProvider = ({children}:{children:any}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [gameList, setGameList] = useState<Game[]>([]);
    const [fourGames, setFourGames] = useState<Game[]>([]);
    const [topTen, setTopTen] = useState<Game[]>([]);
    const [recentlyAdded, setRecentlyAdded] = useState<Game[]>([]);

    // Loads game lists from Firestore
    useEffect(() => {
        getGameList().then(gl => {
            setGameList(gl);
            let fourGamesInit = []
            for(let i=0; i<4; i++) {
                let randomGame = gl[Math.floor(Math.random() * gl.length)];
                fourGamesInit.push(randomGame);
            }
            getTopTen().then(tt => setTopTen(tt));
            getRecentlyAdded().then(ra => setRecentlyAdded(ra));
            setFourGames(fourGamesInit);
            setLoading(false);
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

    // search games when typing in search bar
    const searchGames = (searchText:string, limit:number) => {
        let foundedGames:Game[] = [];
        for(let g of gameList) {
            if(searchText.length == 0)
                break
            if(g.title.toLowerCase().includes(searchText.toLowerCase()))
                foundedGames.push(g);
            if(foundedGames.length >= limit)
                break;
        }
        return foundedGames;
    }

    return <>
        <GamesContext.Provider value={{loading, gameList, fourGames, topTen, recentlyAdded, updateFourGames, searchGames}}>
            {children}
        </GamesContext.Provider>
    </>
}
