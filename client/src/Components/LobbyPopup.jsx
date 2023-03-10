import './Styles/LobbyPopup.css';
import './Styles/Popup.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import * as FetchModule from "../Controller/FetchModule"
import { useNavigate } from "react-router-dom";
/**
 * Displays a Popup for the lobby
 * @returns {ReactElement}
 */
function LobbyPopup() {
    const [code, enterCode] = useState(false);
    const navigate = useNavigate()

    const handleClick = () => {
        enterCode(current => !current)
    }

    function createLobby() {
        (async () => {
            let newRoomCode = await FetchModule.fetchData("/api/lobby")
            navigate("/lobby", { state: { roomCode: newRoomCode } });
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