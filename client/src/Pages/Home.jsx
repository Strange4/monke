import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { LocationContext } from "../Context/LocationContext";
import { useContext, useEffect } from "react";
import CookieBanner from "../Components/CookieBanner";
import { getCookieValue } from "../Controller/CookieHelper";
import { useState } from "react";
import PreferenceContext from "../Context/PreferenceContext";

const Home = () => {
    const locationContext = useContext(LocationContext);

    useEffect(() => {
        locationContext.lastVisitedLocation.current = "/";
    }, []);

    const [enableTTS, setEnableTTS] = useState(getCookieValue("enableTTSQuote"));
    const [ttsSpeed, setTtsSpeed] = useState(getCookieValue("ttsSpeed"));

    /**
     * iife that sets default preference settings
     */
    (()=>{
        enableTTS === undefined ? setEnableTTS("false") : enableTTS;
        ttsSpeed === undefined ? setTtsSpeed("1") : ttsSpeed;
    })();

    return (
        <div id="home">
            <PreferenceContext.Provider value={{
                enableTTSQuote: enableTTS,
                setEnableTTSQuote: setEnableTTS,
                ttsSpeed: ttsSpeed,
                setTtsSpeed: setTtsSpeed
            }}>
                <div className="blur"></div>
                <CookieBanner />
                <NavBar />
                <div id="game-component">
                    <GameSettings />
                    <TypingScreen multiplayer={false}  enableTTS={enableTTS} />
                </div>
            </PreferenceContext.Provider>
        </div>
    );
}

export default Home;