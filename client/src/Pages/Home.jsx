import NavBar from "../components/NavBar";
import TypingScreen from "../components/TypingScreen/TypingScreen";

const Home = () => {
    return (
        <div id="home">
            <NavBar />
            <h1>Home Page</h1>
            <div id="game-component">
                <TypingScreen/>
            </div>
        </div>
    );
}

export default Home;