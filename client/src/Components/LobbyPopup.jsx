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

    const handleClick = () => {
        enterCode(current => !current)
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")
            navigate("/lobby", { state: { roomCode: newRoomCode } });
            console.log(auth)
            socket = io("", { query: { roomCode: newRoomCode }, auth: { userEmail: auth.userEmail } })
            socket.on("connect", () => {

                console.log(socket)
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