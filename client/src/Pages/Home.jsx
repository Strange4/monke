import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";

const Home = (props) => {
    return (
        <div id="home">
            <NavBar loginStatus={props.loginStatus} />
            <h1>Home Page</h1>
            <div id="game-component">
                <TypingScreen />
            </div>
        </div>
    );
}

export default Home;