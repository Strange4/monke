import NavBar from "../components/NavBar";
import TypingScreen from "../components/TypingScreen/TypingScreen";
import GameText from '../components/GameText'

const Home = () => {
    return (
        <div id="home">
            <NavBar />
            <h1>Home Page</h1>
            <div id="game-component">
                <GameText textToDisplay="nice to meet you my friend how's it going?"/>
                <TypingScreen/>
            </div>
        </div>
    );
}

export default Home;