import { GamepadIcon, MenuIcon, SearchIcon } from "./Icons";

export function HomePage () {
    return <>
        <nav className="header">
            <img className="vgp-logo" src="../public/VGP_Logo.png" alt="vgp logo"/>
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