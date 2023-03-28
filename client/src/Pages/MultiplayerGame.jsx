import './Styles/MultiplayerGame.css';
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';
import SocketContext from '../Context/SocketContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import GameProgress from '../Components/MultiplayerGame/GameProgress';
import EndGameLeaderboard from '../Components/MultiplayerGame/EndGameLeaderboard';

const MultiplayerGame = () => {
    const socketContext = useContext(SocketContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [ended, setEnded] = useState(false);

    useEffect(() => {
        socketContext.socket.current ? updateListeners() : navigate("/");
    }, []);

    /**
     * Updates the current lobby listeners and calls
     * a function that sets up new ones for gameplay
     */
    function updateListeners() {
        socketContext.socket.current.off("join-room");
        socketContext.socket.current.off("leave-room");
        socketContext.socket.current.on("leave-room", (users) => {
            socketContext.setUserList(users);
        });
        setUpProgressListeners();
    }

    /**
     * Sets all the progress in game listeners
     */
    function setUpProgressListeners() {
        socketContext.socket.current.on("update-progress", (userList) => {
            socketContext.setUserList(userList);
            let index = userList.findIndex(user => user.id === socketContext.socket.current.id);
            if (userList[index].progress >= 100) {
                setEnded(true);
            }
        });
    }
    
    return (
        <>
            < NavBar />
            {ended ?
                <EndGameLeaderboard/>
                :
                <div id="multiplayer-game">
                    <div id="popup-root" />
                    <div id="playing-players">
                        {socketContext.userList.map((user, i) => {
                            return <PlayerItem
                                key={i} name={user.username}
                                avatar={user.avatar} leader={i === 0} />
                        })}
                    </div>
                    <GameProgress />
                    <TypingScreen multiplayer={true} quote={location.state.quote}/>
                </div>
            }
        </>
    );
}

export default MultiplayerGame;