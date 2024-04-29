import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, where} from "firebase/firestore";
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

export interface UserVotes {
    plot: number;
    graphics: number;
    audio: number;
    enviroment: number;
    gameplay: number;
    vote: number;
}

export const getGameList = async (genre?:string) => {
    const gameCollection = collection(db, "videogames");
    const gameQuery = genre===undefined
        ?query(gameCollection, orderBy("title", "asc"))
        :query(gameCollection, where("genres", "array-contains", genre), orderBy("title", "asc"))
    const gameSnapshot = await getDocs(gameQuery);
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

export const addGameToUser = async (uid:string, gameId:string, gameData:GameData) => {
    const gameDocRef = doc(db, "users", uid, "mygames", gameId);
    await setDoc(gameDocRef, gameData);
}

export const addGameVote = async (uid:string, gameId:string, gameVotes:UserVotes) => {
    const gameDocRef = doc(db, "users", uid, "mygames", gameId);
    await setDoc(gameDocRef, gameVotes, {merge:true});
}

export const getUserGames = async (uid:string) => {
    const gameCollection = collection(db, "users", uid, "mygames");
    const gameQuery = query(gameCollection, orderBy("title", "asc"));
    const gameSnapshot = await getDocs(gameQuery);
    const userGames:Game[] = gameSnapshot.docs.map(doc => ({id:doc.id, ...(doc.data() as GameData)}));
    return userGames;
}

export const getGameFromUser = async (uid:string, gameId:string) => {
    const gameDocRef = doc(db, "users", uid, "mygames", gameId);
    const gameSnapshot = await getDoc(gameDocRef);
    if(gameSnapshot.exists())
        return gameSnapshot.data() as UserVotes;
    else
        return null
}

export const deleteGameFromUser = async (uid:string, gameId:string) => {
    const gameDocRef = doc(db, "users", uid, "mygames", gameId);
    await deleteDoc(gameDocRef);
}