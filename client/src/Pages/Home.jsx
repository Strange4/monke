import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";

const Home = () => {
    return (
        <div id="home">
            <NavBar />
            <h1>Home Page</h1>
            <div id="game-component">
                <TypingScreen />
            </div>
        </div>
    );
}

export default Home;