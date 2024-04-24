import { collection, getDocs} from "firebase/firestore";
import { db } from "./main";

export interface GameData {
    title: string;
    year: number;
    genres: string[];
    platforms: string[];
    plot: number;
    graphics: number;
    audio: number;
    enviroment: number;
    gameplay: number;
    vote: number;
    imgUrl: string;
}

export interface Game extends GameData {
    id: string;
}

export const getGameList = async () => {
    const gameCollection = collection(db, "videogames");
    const gameSnapshot = await getDocs(gameCollection);
    const gameList:Game[] = gameSnapshot.docs.map(doc => ({id:doc.id, ...(doc.data() as GameData)}));
    return gameList;
}