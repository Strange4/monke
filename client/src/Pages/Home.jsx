import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";

const Home = () => {
    return (
        <div id="home">
            <NavBar />
            <h1>Home Page</h1>
            <div id="game-component">
                <GameSettings />
                <TypingScreen />
            </div>
        </div>
    );
}

export default Home;