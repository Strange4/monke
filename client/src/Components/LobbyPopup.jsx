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
    let socket

    const joinLobby = () => {
        if (!socket) {
            socket = io("", { query: { roomCode: roomCode.current.value }, auth: { userEmail: auth.userEmail } })
            setSocketListeners()
        }
        socket.emit("try-join")
    }

    function setSocketListeners() {
        socket.on("join-room", (users, roomCode) => {
            console.log("JOINED ROOM")
            navigate("/lobby", { state: { roomCode: roomCode, users: users } });
        })
        socket.on("leave-room", (users, roomCode) => {
            console.log("leaving room")
            navigate("/lobby", { state: { roomCode: roomCode, users: users } });
        })
        socket.on("kickUser", () => {
            console.log("kicking user")
            navigate("/");
        })
        socket.on("full-room", () => {
            console.log("room full")
            feedback.current.textContent = "ROOM FULL, enter a different room"
            socket.disconnect()
            socket = undefined
        });
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")

            if (!socket) {
                socket = io("", { query: { roomCode: newRoomCode }, auth: { userEmail: auth.userEmail } })
                setSocketListeners()
            }
            socket.emit("try-join")
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