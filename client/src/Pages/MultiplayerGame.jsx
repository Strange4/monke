import './Styles/MultiplayerGame.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';
import SocketContext from '../Context/SocketContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import GameProgress from '../Components/Lobby/GameProgress';
import EndGameResults from './EndGameResults';

const MultiplayerGame = () => {
    const socketContext = useContext(SocketContext)
    const location = useLocation()
    const navigate = useNavigate()
    const [ended, setEnded] = useState(false)

    useEffect(() => {
        if (location.pathname !== "/multiplayer-game") {
            socketContext.socket.current.disconnect()
            socketContext.socket.current = undefined
        }
        if (!socketContext.socket.current) {
            navigate("/")
        }
    }, [location.pathname]);

    useEffect(() => {
        if (socketContext.socket.current) {
            updateListeners()
        }
    })

    function updateListeners() {
        socketContext.socket.current.off("join-room")
        socketContext.socket.current.off("leave-room")

        socketContext.socket.current.on("leave-room", (users) => {
            socketContext.setUserList(users)
        })
        setUpProgressListeners()
    }

    function setUpProgressListeners() {
        socketContext.socket.current.on("update-progress", (userList) => {
            socketContext.setUserList(userList)
        })
        socketContext.socket.current.once("end-game", (userList) => {
            socketContext.setUserList(userList)
            socketContext.socket.current.off("send-progress")
        })
        socketContext.socket.current.on("update-results", (userList) => {
            socketContext.setUserList(userList)
        })
        socketContext.socket.current.on("user-ended", () => {
            setEnded(true)
        })
    }

    return (
        <> {ended ?
            <div id="end-game-leaderboard">
                {socketContext.userList.map((user, i) => {
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
                < NavBar />
                <div id="playing-players">
                    {socketContext.userList.map((user, i) => {
                        return <PlayerItem
                            key={i} name={user.username}
                            avatar={user.avatar} leader={i === 0} />
                    })}
                </div>
                <div id="multiplayer-info">
                    <div id="mode-indicator">
                        <p>percentage indicator will appear here depending on game mode</p>
                    </div>
                    {socketContext.userList.map((user, i) => {
                        return <GameProgress
                            key={i} index={i} progress={Math.round(user.progress)} />
                    })}
                    <TypingScreen multiplayer={true} />
                </div>
            </div>}
        </>
    );
}

export default MultiplayerGame;