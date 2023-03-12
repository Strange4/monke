import './Styles/LobbyPopup.css';
import './Styles/Popup.css'
import { Link } from 'react-router-dom';
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
    const navigate = useNavigate()
    const auth = useContext(AuthContext);
    let socket

    const handleClick = () => {
        enterCode(current => !current)
    }

    const joinLobby = () => {
        navigate("/lobby", { state: { roomCode: roomCode.current.value } });
        console.log(roomCode.current.value)
        socket = io("", { query: { roomCode: roomCode.current.value }, auth: { userEmail: auth.userEmail } })

        socket.on("join-room", (users) => {
            // users.push({ username: userData.username })
            console.log("JOINED ROOM")
            console.log(users)
            // socket.emit("join-room", userData, roomID)
        })

        // socket.on("leave-room", (userData, roomID, users) => {
        //     users.filter(user => user != userData.username)
        // })
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")
            navigate("/lobby", { state: { roomCode: newRoomCode } });
            socket = io("", { query: { roomCode: newRoomCode }, auth: { userEmail: auth.userEmail } })

            socket.on("join-room", (users) => {
                // userList.push({ username: userData.username })
                console.log("CREATED AND JOINED ROOM")
                // socket.emit("join-room", userData, roomID)
                // console.log(userList)
                console.log(users)
            })
        })()
    }


    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <button onClick={createLobby}>Create</button>
            <button onClick={handleClick}>Join</button>
            {code &&
                <div>
                    <input ref={roomCode} type="text" name="code" />
                    <button onClick={joinLobby}>Enter game</button>
                </div>
            }
        </div>
    );
}

export default LobbyPopup;