import { useNavigate } from "react-router-dom";
import { Game } from "./firebaseServices";

export function GameSlot ({game}:{game:Game}) {
    const navigate = useNavigate();

    return <>
        <div className="game-slot" onClick={()=>navigate(`/games/${game.id}`)}>
            <img src={game.imgUrl} />
            <span>{game.title}</span>
        </div>
    </>
}