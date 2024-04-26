import { useEffect, useState } from "react"
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Game, getGameList } from "./firebaseServices";
import { useLoaderData, useNavigate } from "react-router-dom";

export function OverviewPage () {
    const label = useLoaderData() as string;

    const [gameList, setGameList] = useState<Game[]|null>(null)

    useEffect(()=>{
        if(label==="all") {
            getGameList().then(gl=>setGameList(gl));
        }
        else
            getGameList(label).then(gl=>setGameList(gl));
    }, [label])

    if(gameList === null || gameList.length === 0) return <></>

    return <>
        <Header />
        <section className="overview-page-container">
            <div className="overview-title">
                <span className="overview-label">{label==="all"?"All Games":label}</span>
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

function GameSlot ({game}:{game:Game}) {
    const navigate = useNavigate();

    return <>
        <div className="game-slot" onClick={()=>navigate(`/games/${game.id}`)}>
            <img src={game.imgUrl} />
            <span>{game.title}</span>
        </div>
    </>
}