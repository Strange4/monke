import './Styles/MultiplayerGame.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';

const MultiplayerGame = () => {
    return (
        <div id="home">
            <NavBar />
            <div id="playing-players">
                {userList.map((user, i) => {
                    return <PlayerItem
                        key={i} name={user.username}
                        avatar={user.avatar} leader={i === 0} />
                })}
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