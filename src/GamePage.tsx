import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom"
import { Game, getGameById } from "./firebaseServices";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AppleIcon, PlaystationIcon, SwitchIcon, WindowsIcon, XboxIcon } from "./Icons";

export function GamePage () {
    const id = useLoaderData() as string;

    const [game, setGame] = useState<Game|null>(null);

    useEffect(() => {
        getGameById(id).then(g => {
            setGame(g);
        })
    }, [])

    const iconSelector = (platform:string) => {
        switch(platform) {
            case "Windows":
                return <WindowsIcon key={platform}/>
            case "Xbox":
                return <XboxIcon key={platform}/>
            case "PlayStation":
                return <PlaystationIcon key={platform}/>
            case "Switch":
                return <SwitchIcon key={platform}/>
            case "MacOS":
                return <AppleIcon key={platform}/>
        }
    }

    if(game===null) return <></>

    return <>
        <Header />
        <section className="game-page-container">
            <div className="game-container">
                <div className="game-header">
                    <span className="game-title">{game.title}</span>
                    <div className="game-info">
                        <span className="game-year">{game.year}</span>
                        {game.platforms.map(p => iconSelector(p))}
                    </div>
                </div>
                <div className="game-viewer">
                    <div className="game-left">
                        <img src={game.imgUrl}/>
                        <div className="game-genres">
                            {game.genres.map(genre => <span key={genre} className="game-genre">{genre}</span>)}
                        </div>
                    </div>
                    <div className="game-right">
                        <div className="game-votes">
                            <div className="game-vote-singles">
                                <div className="game-vote-top">
                                    <Vote title="plot" value={game.plot}/>
                                    <Vote title="gameplay" value={game.gameplay}/>
                                </div>
                                <div className="game-vote-bottom">
                                    <Vote title="graphics" value={game.graphics}/>
                                    <Vote title="audio" value={game.audio}/>
                                    <Vote title="enviroment" value={game.enviroment}/>
                                </div>
                            </div>
                            <div className="game-vote-avg">
                                <Vote title="vote" value={game.vote}/>
                            </div>
                        </div>
                        <div className="game-buttons">
                            <button>+ Add to MyGames</button>
                            <button>Vote</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
}

function Vote ({title, value}:{title:string, value:number}) {
    const titleConverter = () => {
        switch(title) {
            case "plot":
                return "Plot/Concept";
            case "graphics":
                return "Graphics";
            case "audio":
                return "Audio";
            case "enviroment":
                return "Enviroment";
            case "gameplay":
                return "Gameplay";
            case "vote":
                return "Average";
        }
    }

    return <>
        <div className="game-vote-single">
            {title==="vote"
            ?<CircularProgressBar value={value} dim={150} color="#b700ff"/>
            :<CircularProgressBar value={value} dim={120} color="#ffc400"/>
            }
            <span className="game-vote-value" style={title==="vote"?{fontSize:"60px"}:{}}>{value}</span>
            <span className="game-vote-title" style={title==="vote"?{fontSize:"xx-large", marginTop:"20px"}:{}}>{titleConverter()}</span>
        </div>
    </>
}

function CircularProgressBar ({value, dim, color}:{value:number, dim:number, color:string}) {
    const radius = (dim-20)/2;
    const circumference = 2 * Math.PI * radius;
    const offset = (10-value)/10*(circumference - (90 / 360) * circumference);
    
    return (
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
          <circle
            cx={dim/2}
            cy={dim/2}
            r={radius}
            fill="none"
            stroke="transparent"
            strokeWidth="20"
          />
          <circle
            cx={dim/2}
            cy={dim/2}
            r={radius}
            fill="none"
            stroke="gray"
            strokeWidth="20"
            strokeDasharray={`${circumference - (90 / 360) * circumference} ${circumference}`}
          />
          <circle
            cx={dim/2}
            cy={dim/2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeDasharray={`${circumference - (90 / 360) * circumference} ${circumference}`}
            strokeDashoffset={offset}
          />
        </svg>
  );
}