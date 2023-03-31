import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/Settings/GameSettings";
import { LocationContext } from "../Context/LocationContext";
import { useContext, useEffect, useState} from "react";
import CookieBanner from "../Components/FirstTimeTour/CookieBanner";
import { getCookieValue } from "../Controller/CookieHelper";

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

    return (
        <div id="home">
            <div className="blur"></div>
            <CookieBanner />
            <NavBar />
            <div id="game-component">
                <GameSettings quoteLength={length} setLength={setLength} 
                    punctuation={punctuation} setPunctuation={setPunctuation}/>
                <TypingScreen quoteLength={length} multiplayer={false} punctuation={punctuation} />
            </div>
        </div>
    );
}

export default Home;