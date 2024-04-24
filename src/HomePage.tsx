import { useContext, useRef, useState } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { GamesContext } from "./GamesContext";
import { Game } from "./firebaseServices";
import { ArrowLeft, ArrowRight } from "./Icons";

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
        <GameCarousel gameList={gameCtx.topTen} title={"Top 10"}/>
        <GameCarousel gameList={gameCtx.recentlyAdded} title={"Recently Added"}/>
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
                        return <span className="game-big-genre" key={genre}>{genre}</span>
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

function GameCarousel({gameList, title}:{gameList:Game[], title:string}) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScrollLeft, setMaxScrollLeft] = useState(Infinity);
    
    const viewerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (scrollAmount:number) => {    
        let newMaxScrollLeft = viewerRef.current!.scrollWidth - viewerRef.current!.clientWidth;
        setMaxScrollLeft(newMaxScrollLeft);

        if((scrollPosition == 0 && scrollAmount > 0) || (scrollPosition == maxScrollLeft && scrollAmount < 0) || (scrollPosition > 0 && scrollPosition < maxScrollLeft)) {
            const newScrollPosition = scrollPosition + scrollAmount;
            console.log(maxScrollLeft, newScrollPosition)
            if(newScrollPosition > maxScrollLeft) {
                setScrollPosition(maxScrollLeft);
                viewerRef.current!.scrollLeft = maxScrollLeft;
            }
            else if(newScrollPosition < 0) {
                setScrollPosition(0);
                viewerRef.current!.scrollLeft = 0;
            }
            else {
                setScrollPosition(newScrollPosition);
                viewerRef.current!.scrollLeft = newScrollPosition;
            }
        }
    }
    
    return <>
        <div className="carousel-container">
            <div className="carousel-viewer">
                <span className="carousel-title">{title}</span>
                <div className="hl"></div>
                <div className="carousel" ref={viewerRef}>
                    {scrollPosition>0
                    ?<button className="carousel-arrow-left" onClick={()=>handleScroll(-200)}>
                        <ArrowLeft />
                    </button>
                    :<></>}
                    {gameList.map(g => {
                        return <img 
                            key={g.id}
                            className="carousel-game"
                            src={g.imgUrl}
                        />
                    })}
                    {scrollPosition<maxScrollLeft
                    ?<button className="carousel-arrow-right" onClick={()=>handleScroll(200)}>
                        <ArrowRight />
                    </button>
                    :<></>}
                </div>
            </div>
        </div>
    </>
}