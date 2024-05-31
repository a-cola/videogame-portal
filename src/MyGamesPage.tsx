import { useContext, useEffect, useState } from "react";
import { Game, getUserGames } from "./firebaseServices";
import { UserContext } from "./UserContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GameSlot } from "./GameSlot";
import { useNavigate } from "react-router-dom";
import { NotifyRequest } from "./NotifyRequest";
import { sendNotification } from "./notificationServices";

export function MyGamesPage () {
    const [gameList, setGameList] = useState<Game[]|null>(null);
    const [bestScore, setBestScore] = useState<(string | number)[]>([]);
    const [mostPlayedGenre, setMostPlayedGenre] = useState<string>("");

    const userCtx = useContext(UserContext);

    const navigate = useNavigate();

    // If user is logged gets his game list from Firestore
    useEffect(()=>{
        if(userCtx!.currentUser !== null) {
            getUserGames(userCtx!.currentUser.uid).then(gl=>setGameList(gl));
        }
    }, [userCtx?.currentUser?.uid]);

    useEffect(()=>{
        // Sends a notification if user hasn't had add games to his library yet
        if(gameList !== null && gameList.length==0 && !userCtx?.mygamesNotification) {
            sendNotification(
                "Add games to MyGames",
                "You haven't added any games to your library yet. Click on '+ Add to MyGames' on any game page to do so."
            )
            userCtx!.setMygamesNotification(true);
        }

        // If users has games in his library then best score and most played genre will be computed
        if(gameList !== null && gameList.length>0) {
            setBestScore(findBestScore());
            setMostPlayedGenre(findMostPlayedGenre());
        }
    }, [gameList]);

    // Search for the game that has been valued most by user
    const findBestScore = () => {
        let title = " - ";
        let res = 0;
        for(let game of gameList!) {
            if(game.vote > res) {
                res = game.vote;
                title = game.title;
            }
        }
        return [title, res];
    };

    // Search for the genre that is more present in user game list
    const findMostPlayedGenre = () => {
        let genres:any = {};
        for(let game of gameList!) {
            for(let genre of game.genres) {
                if(genre in genres) {
                    genres[genre]++;
                }
                else {
                    genres[genre] = 1;
                }
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
    };

    if(userCtx?.currentUser == null) navigate('/');

    if(gameList === null) return <></>
    
    return <>
        <NotifyRequest denied={userCtx!.notificationDenied} setDenied={userCtx!.setNotificationDenied}/>
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