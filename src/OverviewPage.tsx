import { useContext, useEffect, useState } from "react"
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Game, getGameList } from "./firebaseServices";
import { useLoaderData } from "react-router-dom";
import { GameSlot } from "./GameSlot";
import { GamesContext } from "./GamesContext";

export function OverviewPage () {
    const label = useLoaderData() as string;

    const [gameList, setGameList] = useState<Game[]|null>(null)
    const [title, setTitle] = useState<string>("")

    const gameCtx = useContext(GamesContext);

    useEffect(()=>{
        if(window.location.href.includes("/genres/")) {
            if(label==="all") {
                getGameList().then(gl=>{
                    setGameList(gl);
                    setTitle("All Games");
                });
            }
            else
                getGameList(label).then(gl=>{
                    setGameList(gl);
                    setTitle(label);
                });
        }
        else if(window.location.href.includes("/search/")) {
            setGameList(gameCtx.searchGames(label, Infinity));
            setTitle(`Search results: ${label}`);
        }
    }, [label, gameCtx.loading])

    if(gameCtx.loading) return <></>

    if(gameList === null || gameList.length === 0) return

    return <>
        <Header />
        <section className="overview-page-container">
            <div className="overview-title">
                <span className="overview-label">{title}</span>
                <div className="hl" style={{border:"solid 3px white"}}/>
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