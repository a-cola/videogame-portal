import { ForwardedRef, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"
import { Game, GameData, UserVotes, addGameToUser, addGameVote, deleteGameFromUser, getGameById, getGameFromUser } from "./firebaseServices";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AppleIcon, PlaystationIcon, SwitchIcon, WindowsIcon, XboxIcon } from "./Icons";
import { UserContext } from "./UserContext";
import { NotifyRequest } from "./NotifyRequest";
import { sendNotification } from "./notificationServices";

export function GamePage () {
    const id = useLoaderData() as string;

    const userCtx = useContext(UserContext);

    const navigate = useNavigate();

    const [game, setGame] = useState<Game|null>(null);
    const [userHasGame, setUserHasGame] = useState(false);
    const [userGame, setUserGame] = useState<Game|null>(null);
    const [lastVote, setLastVote] = useState<number>(Date.now());

    const [voteVisibility, setVoteVisibility] = useState("none");

    useEffect(() => {
        getGameById(id).then(g => {
            setGame(g);
        })
    }, [id])

    useEffect(() => {
        if(userCtx!.currentUser !== null)
            getGameFromUser(userCtx!.currentUser.uid, id).then(g => {
                if(g!==null) {
                    setUserHasGame(true);
                    setUserGame(g);
                }
            })
        else {
            setUserHasGame(false);
            setUserGame(null);
        }
    }, [game, userCtx?.currentUser, userHasGame, lastVote])

    useEffect(()=>{
        if(userHasGame==true && userGame?.vote == 0)
            sendNotification("Vote your games", "Click on the 'Vote' button to submit your scores.");
    }, [userHasGame, userGame])

    const addToMyGames = () => {
        if(userCtx!.currentUser == null)
            navigate("/login");
        else {
            let userGame:GameData = {
                title:game!.title,
                year:game!.year,
                genres:[...game!.genres],
                platforms:[...game!.platforms],
                imgUrl:game!.imgUrl,
                plot:0,
                gameplay:0,
                graphics:0,
                audio:0,
                enviroment:0,
                vote:0
            };
            addGameToUser(userCtx!.currentUser.uid, id, userGame);
            setUserHasGame(true);
        }
    }

    const deleteFromMyGames = () => {
        deleteGameFromUser(userCtx!.currentUser!.uid, id);
        setUserHasGame(false);
    }

    const addVote = (votes:UserVotes) => {
        addGameVote(userCtx!.currentUser!.uid, id, votes);
        setLastVote(Date.now());
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
        <NotifyRequest />
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
                        <img src={game.imgUrl} onError={e=>e.currentTarget.src="/Cover_Not_Loaded.png"}/>
                        <div className="game-genres">
                            {game.genres.map(genre => <button key={genre} className="game-genre" onClick={()=>navigate(`/genres/${genre}`)}>{genre}</button>)}
                        </div>
                    </div>
                    <div className="game-right">
                        {userHasGame&&userGame!=null
                        ?<div className="game-votes-user">
                            <span className="game-vote-vgp-title">VGP votes:</span>
                            <div className="game-vote-vgp">
                                <Vote title="plot" value={game.plot} dim={85} color="#ffc400" stroke={10}/>
                                <Vote title="gameplay" value={game.gameplay} dim={85} color="#ffc400" stroke={10}/>
                                <Vote title="graphics" value={game.graphics} dim={85} color="#ffc400" stroke={10}/>
                                <Vote title="audio" value={game.audio} dim={85} color="#ffc400" stroke={10}/>
                                <Vote title="enviroment" value={game.enviroment} dim={85} color="#ffc400" stroke={10}/>
                                <Vote title="vote" value={game.vote} dim={105} color="#b700ff" stroke={10}/>
                            </div>
                            <span className="game-vote-user-title">Your votes:</span>
                            <div className="game-vote-user">
                                <Vote title="plot" value={userGame!.plot} dim={85} color="#ff9a00" stroke={10}/>
                                <Vote title="gameplay" value={userGame!.gameplay} dim={85} color="#ff9a00" stroke={10}/>
                                <Vote title="graphics" value={userGame!.graphics} dim={85} color="#ff9a00" stroke={10}/>
                                <Vote title="audio" value={userGame!.audio} dim={85} color="#ff9a00" stroke={10}/>
                                <Vote title="enviroment" value={userGame!.enviroment} dim={85} color="#ff9a00" stroke={10}/>
                                <Vote title="vote" value={userGame!.vote} dim={105} color="#00a2ff" stroke={10}/>
                            </div>
                        </div>
                        :<div className="game-votes">
                            <div className="game-vote-singles">
                                <div className="game-vote-top">
                                    <Vote title="plot" value={game.plot} dim={120} color="#ffc400" stroke={20}/>
                                    <Vote title="gameplay" value={game.gameplay} dim={120} color="#ffc400" stroke={20}/>
                                </div>
                                <div className="game-vote-bottom">
                                    <Vote title="graphics" value={game.graphics} dim={120} color="#ffc400" stroke={20}/>
                                    <Vote title="audio" value={game.audio} dim={120} color="#ffc400" stroke={20}/>
                                    <Vote title="enviroment" value={game.enviroment} dim={120} color="#ffc400" stroke={20}/>
                                </div>
                            </div>
                            <div className="game-vote-avg">
                                <Vote title="vote" value={game.vote} dim={150} color="#b700ff" stroke={20}/>
                            </div>
                        </div>
                        }
                            
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

function Vote ({title, value, dim, color, stroke}:{title:string, value:number, dim:number, color:string, stroke:number}) {
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
            <CircularProgressBar value={value} dim={dim} color={color} stroke={stroke}/>
            {title==="vote"
            ?<>
                <span className="game-vote-value-avg">{value}</span>
                <span className="game-vote-title-avg">{titleConverter()}</span>
            </>
            :<>
                <span className="game-vote-value">{value}</span>
                <span className="game-vote-title">{titleConverter()}</span>
            </>
            }
        </div>
    </>
}

function CircularProgressBar ({value, dim, color, stroke}:{value:number, dim:number, color:string, stroke:number}) {
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
            strokeWidth={stroke}
          />
          <circle
            cx={dim/2}
            cy={dim/2}
            r={radius}
            fill="none"
            stroke="gray"
            strokeWidth={stroke}
            strokeDasharray={`${circumference - (90 / 360) * circumference} ${circumference}`}
          />
          <circle
            cx={dim/2}
            cy={dim/2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
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

const VoteModalBox = forwardRef(({label}:{label:string},ref:ForwardedRef<HTMLInputElement>) => (
    <>
        <div className="vote-modal-box">
            <input ref={ref} maxLength={3} placeholder="..."/>
            <span>{label}</span>
        </div>
    </>
));