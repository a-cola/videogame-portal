import { useContext } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { GamesContext } from "./GamesContext";
import { Game } from "./firebaseServices";

export function HomePage () {
    const gameCtx = useContext(GamesContext);

    if(gameCtx.gameList.length === 0) return;

    return <>
        <Header />
        <section className="home-page-container">
            <div className="main-viewer">
                <GameBig game={gameCtx.fourGames[0]}/>
                <div className="main-viewer-list">
                    {gameCtx.fourGames.slice(1).map(g => {
                        return <GameSmall game={g} key={g.id}/>
                    })}
                </div>
            </div>
        </section>
        <Footer />
    </>
}

function GameBig ({game}:{game:Game}) {
    return <>
        <div className="game-big">
            <img src={game.imgUrl} />
            <div className="game-big-info">
                <span className="game-big-title">{game.title}</span>
                <span className="game-big-year">{game.year}</span>
                <span className="game-big-genres">
                    {game.genres.map(genre => {
                        return <span key={genre}>{genre}</span>
                    })}
                </span>
            </div>
        </div>
    </>
}

function GameSmall({game}:{game:Game}) {
    return <>
        <div className="game-small">
            <img src={game.imgUrl} />
            <div className="game-small-info">
                <span className="game-small-title">{game.title}</span>
                <span className="game-small-year">{game.year}</span>
            </div>
        </div>
    </>
}