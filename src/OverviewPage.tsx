import { useContext } from "react"
import { GamesContext } from "./GamesContext"
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Game } from "./firebaseServices";
import { useNavigate } from "react-router-dom";

export function OverviewPage () {
    const gameCtx = useContext(GamesContext);

    if(gameCtx.gameList.length === 0) return <></>

    return <>
        <Header />
        <section className="overview-page-container">
            <div className="overview-games-container">
                {gameCtx.gameList.map((g)=>{
                    return <GameSlot game={g}/>
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