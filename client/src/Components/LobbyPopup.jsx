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
    let userList
    let socket

    const handleClick = () => {
        enterCode(current => !current)
    }

    const joinLobby = () => {
        socket = io("", { query: { roomCode: roomCode.current.value }, auth: { userEmail: auth.userEmail } })

        socket.on("change-room", (users) => {
            console.log("JOINED ROOM")
            console.log(users)
            console.log(users)
            userList = users
            navigate("/lobby", { state: { roomCode: roomCode.current.value , users: userList} });
        })
        
        // socket.on("leave-room", (userData, roomID, users) => {
        //     users.filter(user => user != userData.username)
        // })
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")
            
            socket = io("", { query: { roomCode: newRoomCode }, auth: { userEmail: auth.userEmail } })

            socket.on("change-room", (users) => {
                console.log("CREATED AND JOINED ROOM")
                console.log(users)
                userList = users
                navigate("/lobby", { state: { roomCode: newRoomCode, users: userList} });
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