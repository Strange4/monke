import './Styles/MultiplayerGame.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';
import SocketContext from '../Context/SocketContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const MultiplayerGame = () => {
    const socketContext = useContext(SocketContext)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.pathname !== "/multiplayer-game") {
            socketContext.socket.current.disconnect()
            socketContext.socket.current = undefined
        }
        if (!socketContext.socket.current) {
            navigate("/")
        } 
    }, [location]);

    useEffect(() => {
        if(socketContext.socket.current) {
            updateListeners()
        } 
    }, [])

    function updateListeners() {
        socketContext.socket.current.off("join-room")
        socketContext.socket.current.off("leave-room")
        // socketContext.socket.current.on("join-room", (users) => {
        //     socketContext.setUserList(users)
        //     // TODO: handle what to do when game is already started
        //     console.log("Game started, cannot join")
        //     // navigate("/multiplayer-game", { state: { roomCode: roomCode } });
        // })
        
        socketContext.socket.current.on("leave-room", (users) => {
            socketContext.setUserList(users)
            // TODO: handle what to do when game is already started
            console.log("Someone just left")
            // navigate("/multiplayer-game", { state: { roomCode: roomCode } });
        })
    }

    return (
        <div id="home">
            <NavBar />
            <div id="playing-players">
                {socketContext.userList.map((user, i) => {
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