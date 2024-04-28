import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"
import { Game, UserVotes, addGameToUser, deleteGameFromUser, getGameById, getGameFromUser } from "./firebaseServices";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AppleIcon, PlaystationIcon, SwitchIcon, WindowsIcon, XboxIcon } from "./Icons";
import { UserContext } from "./UserContext";

export function GamePage () {
    const id = useLoaderData() as string;

    const userCtx = useContext(UserContext);

    const navigate = useNavigate();

    const [game, setGame] = useState<Game|null>(null);
    const [userHasGame, setUserHasGame] = useState(false);

    const [voteVisibility, setVoteVisibility] = useState("none");

    useEffect(() => {
        getGameById(id).then(g => {
            setGame(g);
        })
    }, [])

    useEffect(() => {
        if(userCtx!.currentUser !== null)
            getGameFromUser(userCtx!.currentUser.uid, id).then(g => {
                if(g!==null) setUserHasGame(true);
            })
        else
            setUserHasGame(false);
    }, [game, userCtx?.currentUser, userHasGame])

    const addToMyGames = () => {
        if(userCtx!.currentUser == null)
            navigate("/login");
        else {
            addGameToUser(userCtx!.currentUser.uid, id, {} as UserVotes);
            setUserHasGame(true);
        }
    }

    const deleteFromMyGames = () => {
        deleteGameFromUser(userCtx!.currentUser!.uid, id);
        setUserHasGame(false);
    }

    const addVote = (game:UserVotes) => {
        addGameToUser(userCtx!.currentUser!.uid, id, game);
        setVoteVisibility("none");
    }

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
        <VoteModal voteVisibility={voteVisibility} setVoteVisibility={setVoteVisibility} addVote={addVote}/>
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
                            {game.genres.map(genre => <button key={genre} className="game-genre" onClick={()=>navigate(`/genres/${genre}`)}>{genre}</button>)}
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
                            {userHasGame
                            ?<>
                                <button onClick={deleteFromMyGames}>- Remove from MyGames</button>
                                <button onClick={()=>setVoteVisibility("flex")}>Vote</button>
                            </>
                            :<button onClick={addToMyGames}>+ Add to MyGames</button>
                            }
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

function VoteModal ({voteVisibility, setVoteVisibility, addVote}:{voteVisibility:string, setVoteVisibility:React.Dispatch<React.SetStateAction<string>>, addVote:(game: UserVotes) => void}) {
    const plotRef = useRef<HTMLInputElement>(null);
    const gameplayRef = useRef<HTMLInputElement>(null);
    const graphicsRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLInputElement>(null);
    const enviromentRef = useRef<HTMLInputElement>(null);

    const voteRefs = [
        plotRef, gameplayRef, graphicsRef,
        audioRef, enviromentRef
    ]

    const [voteError, setVoteError] = useState(false);

    const checkVotes = () => {
        let sum = 0;
        for(let r of voteRefs) {
            let number = Number(r.current?.value);
            if(number < 1 || number > 10 || isNaN(number)) {
                setVoteError(true);
                return null;
            }
            sum += number;
        }
        let avg = Math.floor((sum/5*10))/10;
        setVoteError(false);
        return avg;
    }

    const handleVote = () => {
        let userVotes:UserVotes;
        let avg = checkVotes();

        if(avg == null) return;

        userVotes = {
            plot:Number(plotRef.current?.value),
            gameplay:Number(gameplayRef.current?.value),
            graphics:Number(graphicsRef.current?.value),
            audio:Number(audioRef.current?.value),
            enviroment:Number(enviromentRef.current?.value),
            vote:avg,
        }

        addVote(userVotes);
        setVoteVisibility("none");
    }

    return <>
        <div className="vote-modal" style={{display:`${voteVisibility}`}}>
            <div className="vote-modal-container">
                <button className="vote-exit-button" onClick={()=>setVoteVisibility("none")}>&times;</button>
                {voteError?<span className="vote-error">Controllare i voti e riprovare...</span>:<></>}
                <div className="vote-modal-top">
                    <VoteModalBox ref={plotRef} label="Plot/Concept"/>
                    <VoteModalBox ref={gameplayRef} label="Gameplay"/>
                </div>
                <div className="vote-modal-bottom">
                    <VoteModalBox ref={graphicsRef} label="Graphics"/>
                    <VoteModalBox ref={audioRef} label="Audio"/>
                    <VoteModalBox ref={enviromentRef} label="Enviroment"/>
                </div>
                <button className="vote-button" onClick={handleVote}>Vote</button>
            </div>
        </div>
    </>
}

const VoteModalBox = forwardRef(({label}:{label:string},ref:any) => (
    <>
        <div className="vote-modal-box">
            <input ref={ref} maxLength={3} placeholder="..."/>
            <span>{label}</span>
        </div>
    </>
));