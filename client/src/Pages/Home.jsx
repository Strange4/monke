import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { LocationContext } from "../Context/LocationContext";
import { useContext, useEffect, useState} from "react";
import CookieBanner from "../Components/CookieBanner";
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
                <GameSettings setLength={setLength}/>
                <TypingScreen quoteLength={length} multiplayer={false} />
            </div>
        </div>
    );
}

export default Home;