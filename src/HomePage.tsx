import { useContext, useEffect, useRef, useState } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { GamesContext } from "./GamesContext";
import { Game } from "./firebaseServices";
import { ArrowLeft, ArrowRight } from "./Icons";
import { useNavigate } from "react-router-dom";
import { NotifyRequest } from "./NotifyRequest";
import { UserContext } from "./UserContext";
import { sendNotification } from "./notificationServices";

export function HomePage () {
    const gameCtx = useContext(GamesContext);
    const userCtx = useContext(UserContext);

    // If user is not logged sends a notification
    useEffect(()=>{
        if(userCtx?.currentUser == null && userCtx?.loading==false && !userCtx.homeNotification) {
            sendNotification("SignIn", "Sign in to unlock all VGP functionalities.");
            userCtx.setHomeNotification(true);
        }
    }, [userCtx?.loading]);

    if(gameCtx.loading) return;

    return <>
        <NotifyRequest denied={userCtx!.notificationDenied} setDenied={userCtx!.setNotificationDenied}/>
        <Header />
        <section className="home-page-container">
            <div className="main-viewer">
                <GameBig game={gameCtx.fourGames[0]} updateGames={gameCtx.updateFourGames}/>
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

// Handles the left side of main viewer
function GameBig ({game, updateGames}:{game:Game, updateGames:()=>void}) {
    const navigate = useNavigate();

    return <>
        <div className="game-big">
            <ProgressBar onProgressComplete={updateGames}/>
            <img src={game.imgUrl} onError={e=>e.currentTarget.src="/Cover_Not_Loaded.png"} onClick={()=>navigate(`/games/${game.id}`)} alt={game.title}/>
            <div className="game-big-info">
                <span className="game-big-title" onClick={()=>navigate(`/games/${game.id}`)}>{game.title}</span>
                <span className="game-big-year">{game.year}</span>
                <span className="game-big-genres">
                    {game.genres.map(genre => {
                        return <span className="game-big-genre" key={genre} onClick={()=>navigate(`/genres/${genre}`)}>{genre}</span>
                    })}
                </span>
            </div>
        </div>
    </>
}

// Handles games in right side of main viewer
function GameSmall({game}:{game:Game}) {
    const navigate = useNavigate();
    
    return <>
        <div className="game-small" onClick={()=>navigate(`/games/${game.id}`)}>
            <img src={game.imgUrl} onError={e=>e.currentTarget.src="/Cover_Not_Loaded.png"} alt={game.title}/>
            <div className="game-small-info">
                <span className="game-small-title">{game.title}</span>
                <span className="game-small-year">{game.year}</span>
            </div>
        </div>
    </>
}

function GameCarousel({gameList, title}:{gameList:Game[], title:string}) {
    const navigate = useNavigate();

    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScrollLeft, setMaxScrollLeft] = useState(Infinity); // Used to handle infinite scroll
    
    const viewerRef = useRef<HTMLDivElement>(null);

    // Handles scroll with arrows
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
    };
    
    return <>
        <div className="carousel-container">
            <div className="carousel-viewer">
                <span className="carousel-title">{title}</span>
                <div className="hl"></div>
                <div className="carousel" ref={viewerRef}>
                    {scrollPosition>0
                    ?<button aria-label="arrow-left" className="carousel-arrow-left" onClick={()=>handleScroll(-200)}>
                        <ArrowLeft />
                    </button>
                    :<></>}
                    {gameList.map(g => {
                        return <img 
                            key={g.id}
                            className="carousel-game"
                            src={g.imgUrl}
                            onError={e=>e.currentTarget.src="/Cover_Not_Loaded.png"}
                            onClick={()=>navigate(`/games/${g.id}`)}
                            alt={g.title}
                        />
                    })}
                    {scrollPosition<maxScrollLeft
                    ?<button aria-label="arrow-right" className="carousel-arrow-right" onClick={()=>handleScroll(200)}>
                        <ArrowRight />
                    </button>
                    :<></>}
                </div>
            </div>
        </div>
    </>
}

// Handles games slideshow in main viewer
function ProgressBar({onProgressComplete}:{onProgressComplete:()=>void}) {
    const [progress, setProgress] = useState<number>(0);

    useEffect(()=>{
        if(progress >= 100) {
            onProgressComplete();
            setProgress(0);
        }
    }, [progress, onProgressComplete]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => oldProgress + 5)
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return <>
        <div className="progress-bar" style={{width:`${progress}%`}}/>
    </>
}