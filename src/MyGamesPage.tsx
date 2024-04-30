import { useContext, useEffect, useState } from "react";
import { Game, getUserGames } from "./firebaseServices";
import { UserContext } from "./UserContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GameSlot } from "./GameSlot";
import { useNavigate } from "react-router-dom";

export function MyGamesPage () {
    const [gameList, setGameList] = useState<Game[]|null>(null)
    const userCtx = useContext(UserContext);

    const [bestScore, setBestScore] = useState<(string | number)[]>([]);
    const [mostPlayedGenre, setMostPlayedGenre] = useState<string>("");

    const navigate = useNavigate();

    if(userCtx?.currentUser == null) navigate('/');

    useEffect(()=>{
        if(userCtx!.currentUser !== null)
            getUserGames(userCtx!.currentUser.uid).then(gl=>setGameList(gl));       
    }, [userCtx?.currentUser?.uid])

    const findBestScore = () => {
        let title = "";
        let res = 0;
        for(let game of gameList!) {
            if(game.vote > res) {
                res = game.vote;
                title = game.title;
            }
        }
        return [title, res];
    }

    const findMostPlayedGenre = () => {
        let genres:any = {};
        for(let game of gameList!) {
            for(let genre of game.genres) {
                if(genre in genres) genres[genre]++;
                else genres[genre] = 1;
            }
        }
        let res = 0;
        let genre = "";
        for(let g in genres) {
            if(genres[g] > res) {
                res = genres[g];
                genre = g;
            }
        }
        return genre;
    }

    useEffect(()=>{
        if(gameList !== null && gameList.length>0) {
            setBestScore(findBestScore());
            setMostPlayedGenre(findMostPlayedGenre());
        }
    }, [gameList])
    
    if(gameList === null) return <></>
    
    return <>
        <Header />
        <section className="my-games">
            <span className="my-games-title">My Games</span>
            <div className="my-games-stats">
                <div className="games-owned">
                    <span className="games-owned-label">Owned Games:</span>
                    <span className="games-number">{gameList.length}</span>
                </div>
                <div className="vl-l"/>
                <div className="best-score">
                    <span className="best-score-label">Best Score:</span>
                    <span className="best-score-name">{gameList.length>0?bestScore[0]:" - "}</span>
                </div>
                <div className="vl-r"/>
                <div className="popular-genre">
                    <span className="popular-genre-label">Most Played Genre:</span>
                    <span className="popular-genre-title">{gameList.length>0?mostPlayedGenre:" - "}</span>
                </div>
            </div>
            <div className="overview-games-container">
                {gameList.map((g)=>{
                    return <GameSlot key={g.id} game={g}/>
                })}
            </div>
        </section>
        <Footer />
    </>
}