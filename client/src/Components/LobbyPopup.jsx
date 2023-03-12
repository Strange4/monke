import './Styles/LobbyPopup.css';
import './Styles/Popup.css'
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
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
    const navigate = useNavigate()
    const auth = useContext(AuthContext);
    let socket
    let users = []

    const joinLobby = () => {
        enterCode(current => !current)

        
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")
            navigate("/lobby", { state: { roomCode: newRoomCode } });
            socket = io("", { query: { roomCode: newRoomCode }, auth: { userEmail: auth.userEmail } })

            socket.on("join-room", (userData, roomID) => {
                users.push({ username: userData.username })
                console.log("JOINED ROOM")
                console.log(userData)
                console.log(roomID)
                console.log(socket)
                console.log(users)
                // socket.emit("join-room", userData, roomID)
            })
        })()
    }


    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <button onClick={createLobby}>Create</button>
            <button onClick={joinLobby}>Join</button>
            {code &&
                <div>
                    <input type="text" name="code" />
                    <Link to='/lobby'>
                        <button>Enter game</button>
                    </Link>
                </div>
            }
        </div>
    );
}

export default LobbyPopup;