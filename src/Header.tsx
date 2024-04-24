import { useNavigate } from "react-router-dom";
import { GamepadIcon, MenuIcon, SearchIcon } from "./Icons";

export function Header() {
    const navigate = useNavigate();

    return <>
        <nav className="header">
            <button
                className="home-button" 
                type="button"
                onClick={()=>navigate('/')}
            >
                <img className="vgp-logo" src="../public/VGP_Logo.png" alt="vgp logo"/>
            </button>
            <button className="menu" type="button">
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
    </>
}