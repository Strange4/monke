import './Styles/MultiplayerGame.css';
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';
import SocketContext from '../Context/SocketContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import GameProgress from '../Components/Lobby/GameProgress';
import EndGameResults from './EndGameResults';

const MultiplayerGame = () => {
    const socketContext = useContext(SocketContext);
    const navigate = useNavigate();
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
        });
        socketContext.socket.current.once("user-ended", () => {
            setEnded(true);
        });
    }

    function sortGameLeaderboard(a, b) {
        if (a.results === undefined || b.results === undefined) {
            return 1
        } else if (a.results.wpm * a.results.acc > b.results.wpm * b.results.acc) {
            return 1;
        } else if (a.results.wpm * a.results.acc < b.results.wpm * b.results.acc) {
            return -1;
        } else {
            return 0;
        }
    }

    return (
        <>
            < NavBar />
            {ended ?
                <div id="end-game-leaderboard">
                    <h1> END OF GAME </h1>
                    {socketContext.userList.sort((a, b) => sortGameLeaderboard(a, b)).map((user, i) => {
                        return <EndGameResults
                            key={i} name={user.username}
                            avatar={user.avatar}
                            wpm={user.results?.wpm}
                            acc={user.results?.accuracy}
                        />
                    })}
                </div>
                :
                <div id="multiplayer-game">
                    <div id="playing-players">
                        {socketContext.userList.map((user, i) => {
                            return <PlayerItem
                                key={i} name={user.username}
                                avatar={user.avatar} leader={i === 0} />
                        })}
                    </div>
                    <div id="multiplayer-info">
                        {socketContext.userList.map((user, i) => {
                            return <GameProgress
                                key={i} index={i} progress={Math.round(user.progress)} />
                        })}
                        <TypingScreen multiplayer={true} />
                    </div>
                </div>
            }
        </>
    );
}

export default MultiplayerGame;