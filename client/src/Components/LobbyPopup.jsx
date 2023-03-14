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
        (async () => {
            await setUpSocket(roomCode.current.value)
        })()
    }

    function setSocketListeners() {
        auth.socket.current.on("join-room", (users, roomCode) => {
            navigate("/lobby", { state: { roomCode: roomCode, users: users } });
        })
        auth.socket.current.on("leave-room", (users, roomCode) => {
            navigate("/lobby", { state: { roomCode: roomCode, users: users } });
        })
        auth.socket.current.on("full-room", () => {
            feedback.current.textContent = "ROOM FULL, enter a different room"
            auth.socket.current.disconnect()
            auth.socket.current = undefined
        });
    }

    async function setUpSocket(roomCode) {
        if (auth.socket.current) {
            auth.socket.current.disconnect()
            auth.socket.current = undefined
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
        auth.socket.current = io("", { query: { roomCode: roomCode }, auth: { userData } })
        setSocketListeners()
        auth.socket.current.emit("try-join")
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")
            await setUpSocket(newRoomCode)
        })()
    }

    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <button onClick={createLobby}>Create</button>
            <button onClick={() => {
                enterCode(current => !current)
            }}>Join</button>
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