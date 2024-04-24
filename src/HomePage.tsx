import { Footer } from "./Footer";
import { Header } from "./Header";

export function HomePage () {
    return <>
        <Header />
        <section className="home-page-container">
            <div className="main-viewer">
                <GameBig />
                <div className="main-viewer-list">
                    <li><GameSmall /></li>
                    <li><GameSmall /></li>
                    <li><GameSmall /></li>
                </div>
            </div>
        </section>
        <Footer />
    </>
}

function GameBig () {
    return <>
        <div className="game-big">
            <img />
            <div className="game-big-info">
                <span className="game-big-title">title</span>
                <span className="game-big-year">year</span>
                <span className="game-big-genres">
                    generi
                </span>
            </div>
        </div>
    </>
}

function GameSmall() {
    return <>
        <div className="game-small">
            <img />
            <div className="game-small-info">
            <span className="game-small-title">title</span>
                <span className="game-small-year">year</span>
            </div>
        </div>
    </>
}