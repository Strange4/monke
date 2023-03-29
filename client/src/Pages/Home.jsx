import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { LocationContext, LocationContextProvider } from "../Context/LocationContext";
import { isRouteInvalid } from "../Components/SecureNavigation/UrlRoutes";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useEffect } from "react";

const Home = () => {
    const navigate = useNavigate()
    const locationContext = useContext(LocationContext)

    useEffect(() => {
        locationContext.lastVisitedLocation.current = "/"
    }, [])
    

    return (
        <div id="home">
            <NavBar />
            <div id="game-component">
                <GameSettings />
                <TypingScreen multiplayer={false} />
            </div>
        </div>
    );
}

export default Home;