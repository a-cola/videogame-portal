import { useNavigate } from "react-router-dom";
import { GamepadIcon, MenuIcon, SearchIcon } from "./Icons";
import { useState } from "react";

export function Header() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    return <>
        <nav className="header">
            <button
                className="home-button" 
                type="button"
                onClick={()=>navigate('/')}
            >
                <img className="vgp-logo" src="../public/VGP_Logo.png" alt="vgp logo"/>
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
            <button className="login-button" type="button">
                <span>Sign In</span>
            </button>
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
    
    return <>
        <div className="dropdown">
            {GENRES.map((g)=><button>{g}</button>)}
        </div>
    </>
}