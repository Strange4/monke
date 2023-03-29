import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { getCookieValue } from "../Controller/CookieClass";
import { useState } from "react";

const Home = () => {
    const [enableTTS, setEnableTTS] = useState(getCookieValue("enableTTSQuote"));

    return (
        <div id="home">
            <NavBar setEnableTTS={setEnableTTS} />
            <div id="game-component">
                <GameSettings />
                <TypingScreen multiplayer={false} enableTTS={enableTTS} />
            </div>
        </div>
    );
}

export default Home;