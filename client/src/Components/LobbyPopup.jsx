import './Styles/LobbyPopup.css';
import './Styles/Popup.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';

/**
 * Displays a Popup for the lobby
 * @returns {ReactElement}
 */
function Lobby() {
    const [code, enterCode] = useState(false);

    const handleClick = () => {
        enterCode(current => !current)
    }
    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <Link to='/lobby'>
                <button>Create</button>
            </Link>
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

export default Lobby;