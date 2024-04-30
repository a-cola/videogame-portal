import { useNavigate } from "react-router-dom";
import { GamepadIcon, MenuIcon, SearchIcon } from "./Icons";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { GamesContext } from "./GamesContext";
import { Game } from "./firebaseServices";

export function Header() {
    const navigate = useNavigate();

    const userCtx = useContext(UserContext);
    const gameCtx = useContext(GamesContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<Game[]>([]);

    const searchTextRef = useRef<HTMLInputElement>(null);

    const searchGames = () => {
        let foundedGames:Game[] = [];
        for(let g of gameCtx.gameList) {
            if(searchTextRef.current?.value == null || searchTextRef.current?.value.length == 0)
                break
            if(g.title.toLowerCase().includes(searchTextRef.current?.value.toLowerCase()))
                foundedGames.push(g);
            if(foundedGames.length >= 5)
                break;
        }
        return foundedGames;
    }

    useEffect(() => {
        let res = searchGames();
        if (res.length > 0) {
            setSearchActive(true);
        }
        else {
            setSearchActive(false);
        }
        setResults(res);
    }, [searchText])

    return <>
        <nav className="header">
            <button
                className="home-button" 
                type="button"
                onClick={()=>navigate('/')}
            >
                <img className="vgp-logo" src="../VGP_Logo.png" alt="vgp logo"/>
            </button>
            <button className="menu" type="button" onClick={()=>setMenuOpen(!menuOpen)} style={menuOpen?{backgroundColor:"#00a2ff"}:{}}>
                <MenuIcon />
                <span>Menu</span>
            </button>
            <div className="search-bar">
                <input
                    className="search-bar-input"
                    type="text"
                    placeholder="Search VGP"
                    ref={searchTextRef}
                    onChange={()=>setSearchText(searchTextRef.current!.value)}
                    onFocus={()=>setSearchActive(true)}
                    onBlur={()=>setSearchActive(false)}
                />
                <SearchIcon />
            </div>
            <button className="mygames-button" type="button" onClick={()=>{userCtx?.currentUser==null?navigate("/login"):navigate("/mygames")}}>
                <GamepadIcon />
                <span>MyGames</span>
            </button>
            {userCtx?.currentUser===null
            ?<button className="login-button" type="button" onClick={()=>navigate('/login')}>
                <span>Sign In</span>
            </button>
            :<button className="login-button" type="button" onClick={()=>{userCtx?.logout(); navigate('/')}}>
                <span>Logout</span>
            </button>
            }
            
        </nav>
        {menuOpen?<MenuDropdown setMenuOpen={setMenuOpen}/>:<></>}
        {searchActive?<SearchDropdown results={results}/>:<></>}
    </>
}

function MenuDropdown({setMenuOpen}:{setMenuOpen:React.Dispatch<React.SetStateAction<boolean>>}) {
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
                    onClick={()=>{navigate(`/genres/${g}`); setMenuOpen(false)}}>{g}</button>)}
            </div>
            <button 
                className="dropdown-showall"
                onClick={()=>{navigate(`/genres/all`); setMenuOpen(false)}}>Show All Games</button>
        </div>
    </>
}

function SearchDropdown ({results}:{results:Game[]}) {   
    return <>
        <div className="search-dropdown">
            <div className="search-results">
                {results.map((g)=>
                    <div key={g.id} className="search-result">
                        <img className="search-result-img" src={g.imgUrl}/>
                        <span className="search-result-title">{g.title}</span>
                    </div>
                )}
            </div>
        </div>
    </>
};