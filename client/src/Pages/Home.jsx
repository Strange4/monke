import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import CookieBanner from "../Components/CookieBanner";

const Home = () => {

    return (
        <div id="home">
            <div className="blur"></div>
            <CookieBanner/>
            <NavBar />
            <div id="game-component">
                
                <GameSettings />
                <TypingScreen multiplayer={false}/>
            </div>
        </div>

    );
}

export default Home;