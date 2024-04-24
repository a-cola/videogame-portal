import { getAuth } from "firebase/auth";
import { app } from "./main";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export interface Game {
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

const auth = getAuth(app);
const db = getFirestore(app);

export const getGameList = async () => {
    const gameCollection = collection(db, "videogames");
    const gameSnapshot = await getDocs(gameCollection);
    const gameList:Game[] = gameSnapshot.docs.map(doc => doc.data() as Game);
    return gameList;
}