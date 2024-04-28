import { useNavigate } from "react-router-dom";
import { GamepadIcon, MenuIcon, SearchIcon } from "./Icons";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

export function Header() {
    const navigate = useNavigate();

    const userCtx = useContext(UserContext);

    const [open, setOpen] = useState(false);

    return <>
        <nav className="header">
            <button
                className="home-button" 
                type="button"
                onClick={()=>navigate('/')}
            >
                <img className="vgp-logo" src="../VGP_Logo.png" alt="vgp logo"/>
            </button>
            <button className="menu" type="button" onClick={()=>setOpen(!open)} style={open?{backgroundColor:"#00a2ff"}:{}}>
                <MenuIcon />
                <span>Menu</span>
            </button>
            <div className="search-bar">
                <input
                    className="search-bar-input"
                    type="text"
                    placeholder="Search VGP"
                />
                <SearchIcon />
            </div>
            <button className="mygames-button" type="button">
                <GamepadIcon />
                <span>MyGames</span>
            </button>
            {userCtx?.currentUser===null
            ?<button className="login-button" type="button" onClick={()=>navigate('/login')}>
                <span>Sign In</span>
            </button>
            :<button className="login-button" type="button" onClick={userCtx?.logout}>
                <span>Logout</span>
            </button>
            }
            
        </nav>
        {open?<MenuDropdown/>:<></>}
    </>
}

function MenuDropdown() {
    const GENRES = [
        'Action',        'Adventure',
        'Battle Royale', 'Card',
        'Casual',        'Co-op',
        'Driving',       'FPS',
        'Fighting',      'Horror',
        'Multiplayer',   'Parkour',
        'Platform',      'Post-apocalyptic',
        'Puzzle',        'Racing',
        'Rhythm',        'Run And Gun',
        'Simulation',    'Soccer',
        'Space',         'Strategy',
        'Superheroes',   'Survival',
        'TPS',           'Time Travel',
        'Zombie'
    ];

    const navigate = useNavigate();
    
    return <>
        <div className="dropdown">
            <span>Genres:</span>
            <div className="dropdown-genres-container">
                {GENRES.map((g)=><button
                    key={g}
                    className="dropdown-genre"
                    onClick={()=>navigate(`/genres/${g}`)}>{g}</button>)}
            </div>
            <button 
                className="dropdown-showall"
                onClick={()=>navigate(`/genres/all`)}>Show All Games</button>
        </div>
    </>
}