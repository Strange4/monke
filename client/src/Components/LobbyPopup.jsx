import './Styles/LobbyPopup.css';
import './Styles/Popup.css'
import { useState, useContext, useRef } from 'react';

import AuthContext from '../Context/AuthContext';
import * as FetchModule from "../Controller/FetchModule"
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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

    const joinLobby = () => {
        if (!auth.socket.current) {
            auth.socket.current = io("", { query: { roomCode: roomCode.current.value }, auth: { userEmail: auth.userEmail } })
            setSocketListeners()
        }
        auth.socket.current.emit("try-join")
    }

    function setSocketListeners() {
        auth.socket.current.on("join-room", (users, roomCode) => {
            console.log("JOINED ROOM")
            navigate("/lobby", { state: { roomCode: roomCode, users: users } });
        })
        auth.socket.current.on("leave-room", (users, roomCode) => {
            console.log("leaving room")
            navigate("/lobby", { state: { roomCode: roomCode, users: users } });
        })
        auth.socket.current.on("kickUser", () => {
            console.log("kicking user")
            navigate("/");
        })
        auth.socket.current.on("full-room", () => {
            console.log("room full")
            feedback.current.textContent = "ROOM FULL, enter a different room"
            auth.socket.current.disconnect()
            auth.socket.current = undefined
        });
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")

            if (!auth.socket.current) {
                auth.socket.current = io("", { query: { roomCode: newRoomCode }, auth: { userEmail: auth.userEmail } })
                setSocketListeners()
            }
            auth.socket.current.emit("try-join")
        })()
    }

    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <button onClick={createLobby}>Create</button>
            <button onClick={() => { enterCode(current => !current) }}>Join</button>
            {code &&
                <div>
                    <input ref={roomCode} type="text" name="code" />
                    <button onClick={joinLobby}>Enter game</button>
                    <p ref={feedback}></p>
                </div>
            }
        </div>
    );
}

export default LobbyPopup;