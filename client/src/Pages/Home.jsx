import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { LocationContext } from "../Context/LocationContext";
import { useContext, useEffect, useState } from "react";
import CookieBanner from "../Components/CookieBanner";
import { getCookieValue } from "../Controller/CookieHelper";
import PreferenceContext from "../Context/PreferenceContext";
import { AiFillInfoCircle } from "react-icons/ai"

const Home = () => {

    // Sets the quote length depending on cookie settings.
    const quoteLength = getCookieValue("quoteLength");
    let cookieLength;
    if (quoteLength === "random" || quoteLength === undefined){
        cookieLength = "random";
    } else{
        cookieLength = quoteLength;
    }
    
    const [length, setLength] = useState(cookieLength);

    // Sets the punctuation from the cookie and converts to a bool.
    const punctuationCookie = getCookieValue("punctuation");
    let punctuationValue;
    if (punctuationCookie === undefined){
        punctuationValue = false;
    } else{
        // eslint-disable-next-line
        if (punctuationCookie === "true"){
            punctuationValue = true;
        } else {
            punctuationValue = false;
        }
    }

    const [punctuation, setPunctuation] = useState(punctuationValue);

    const locationContext = useContext(LocationContext);

    useEffect(() => {
        locationContext.lastVisitedLocation.current = "/";
    }, []);

    const [enableTTS, setEnableTTS] = useState(getCookieValue("enableTTSQuote"));
    const [ttsSpeed, setTtsSpeed] = useState(getCookieValue("ttsSpeed"));
    const [ttsVoice, setTtsVoice] = useState(getCookieValue("ttsVoice"));

    /**
     * iife that sets default preference settings if undefined
     */
    (()=>{
        enableTTS || setEnableTTS("false");
        ttsSpeed || setTtsSpeed("1");
    })();

    return (
        <div id="home">
            <PreferenceContext.Provider value={{
                enableTTSQuote: enableTTS,
                setEnableTTSQuote: setEnableTTS,
                ttsSpeed: ttsSpeed,
                setTtsSpeed: setTtsSpeed,
                ttsVoice: ttsVoice,
                setTtsVoice: setTtsVoice
            }}>
                <div className="blur"></div>
                <CookieBanner />
                <NavBar />
                <div id="game-component">
                    <GameSettings quoteLength={length} setLength={setLength} 
                        punctuation={punctuation} setPunctuation={setPunctuation}/>
                    <TypingScreen quoteLength={length} multiplayer={false}
                        punctuation={punctuation} />
                </div>
            </PreferenceContext.Provider>
            <div id="info-container">
                <a 
                    id="info-link" 
                    href="https://www.gutenberg.org/" 
                    target="_blank"
                    rel="noreferrer">
                    <AiFillInfoCircle id="info-icon"/>
                </a>
                <p className="hide">
                All quotes provided by books in 
                        Project Gutenberg
                </p>
            </div>
        </div>
    );
}

export default Home;