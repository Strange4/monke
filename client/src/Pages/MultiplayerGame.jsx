import './Styles/MultiplayerGame.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';

const MultiplayerGame = () => {
    return (
        <div id="home">
            <NavBar />
            <div id="playing-players">
                <PlayerItem name="name"/>
                <PlayerItem/>
                <PlayerItem/>
                <PlayerItem/>
                <PlayerItem/>
            </div>
            <div id="multiplayer-info">
                <div id="mode-indicator">
                    <p>A time or percentage indicator will appear here depending on game mode</p>
                </div>
                <TypingScreen />
            </div>
        </div>
    );
}

export default MultiplayerGame;