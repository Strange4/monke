import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";

const Home = () => {
    return (
        <div id="home">
            <NavBar />
            <div id="game-component">
                <GameSettings />
                <TypingScreen multiplayer={false}/>
            </div>
        </div>
    );
}

export default Home;