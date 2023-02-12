import NavBar from "../components/NavBar";
import TypingGame from "../components/TypingGame";

const Home = () => {
    return (
        <div id="home">
            <NavBar />
            <h1>Home Page</h1>
            <div id="game-component">
                <TypingGame/>
            </div>
        </div>
    );
}

export default Home;