import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { LocationContext } from "../Context/LocationContext";
import { useContext, useEffect } from "react";
import CookieBanner from "../Components/CookieBanner";

const Home = () => {
    const locationContext = useContext(LocationContext);

    useEffect(() => {
        locationContext.lastVisitedLocation.current = "/";
    }, []);

    return (
        <div id="home">
            <div className="blur"></div>
            <CookieBanner />
            <NavBar />
            <div id="game-component">
                <GameSettings />
                <TypingScreen multiplayer={false} />
            </div>
        </div>
    );
}

export default Home;