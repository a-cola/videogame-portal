import { collection, doc, getDoc, getDocs, limit, orderBy, query} from "firebase/firestore";
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

export const getTopTen = async () => {
    const gameCollection = collection(db, "videogames");
    const gameQuery = query(gameCollection, orderBy("vote", "desc"), limit(10));
    const gameSnapshot = await getDocs(gameQuery);
    const gameTopTen:Game[] = gameSnapshot.docs.map(doc => ({id:doc.id, ...(doc.data() as GameData)}));
    return gameTopTen;
}

export const getRecentlyAdded = async () => {
    const gameCollection = collection(db, "videogames");
    const gameQuery = query(gameCollection, orderBy("year", "desc"), limit(10));
    const gameSnapshot = await getDocs(gameQuery);
    const gameTopTen:Game[] = gameSnapshot.docs.map(doc => ({id:doc.id, ...(doc.data() as GameData)}));
    return gameTopTen;
}

export const getGameById = async (id:string) => {
    const gameDocRef = doc(db, "videogames", id);
    const gameSnapshot = await getDoc(gameDocRef);
    const game:Game = gameSnapshot.data() as Game;
    return game;
}