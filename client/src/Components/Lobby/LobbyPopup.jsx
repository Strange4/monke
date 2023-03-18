import './Styles/LobbyPopup.css';
import '../Styles/Popup.css'
import { useState, useContext, useRef } from 'react';

import AuthContext from '../../Context/AuthContext';
import * as FetchModule from "../../Controller/FetchModule"
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SocketContext from '../../Context/SocketContext';

/**
 * Displays a Popup for the lobby
 * @returns {ReactElement}
 */
function LobbyPopup() {
    const [code, enterCode] = useState(false);
    const roomCode = useRef()
    const feedback = useRef()
    const navigate = useNavigate()
    const auth = useContext(AuthContext);
    const socketContext = useContext(SocketContext)

    const joinLobby = async () => {
        await setUpSocket(roomCode.current.value)
    }

    const createLobby = async () => {
        let newRoomCode = await FetchModule.fetchData("/api/lobby")
        await setUpSocket(newRoomCode)
    }

    function setSocketListeners() {
        socketContext.socket.current.on("join-room", (users, roomCode) => {
            socketContext.setUserList(users)
            navigate("/lobby", { state: { roomCode: roomCode } });
        })
        socketContext.socket.current.on("leave-room", (users, roomCode) => {
            socketContext.setUserList(users)
            navigate("/lobby", { state: { roomCode: roomCode } });
        })
        socketContext.socket.current.on("full-room", () => {
            feedback.current.textContent = "ROOM FULL, enter a different room"
            socketContext.socket.current.disconnect()
            socketContext.socket.current = undefined
        });
        socketContext.socket.current.on("start-game", () => {
            navigate("/multiplayer-game", { state: { roomCode: roomCode } });
        })
        socketContext.socket.current.on("game-started", () => {
            feedback.current.textContent = "GAME ALREADY STARTED, cannot join the room"
        })
    }

    async function setUpSocket(roomCode) {
        if (socketContext.socket.current) {
            socketContext.socket.current.disconnect()
            socketContext.socket.current = undefined
        }
        let userData = {
            userEmail: auth.userEmail,
            avatar: "",
            username: ""
        }
        if (auth.userEmail) {
            const url = "/api/user"
            const data = await FetchModule.postData(url, { email: auth.userEmail }, "POST")
            userData["avatar"] = data.picture_url
            userData["username"] = data.username
        }
        socketContext.socket.current = io("", { query: { roomCode: roomCode }, auth: { userData } })
        setSocketListeners()
        socketContext.socket.current.emit("try-join")
    }

    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <button onClick={async () => await createLobby()}>Create</button>
            <button onClick={() => enterCode(current => !current)}>Join</button>
            {code &&
                <div>
                    <input ref={roomCode} type="text" name="code" />
                    <button onClick={async () => await joinLobby()}>Enter game</button>
                    <p ref={feedback}></p>
                </div>
            }
        </div>
    );
}

export default LobbyPopup;