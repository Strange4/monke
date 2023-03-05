import './Styles/LobbyPopup.css';
import './Styles/Popup.css'
import { Link } from 'react-router-dom';

/**
 * Displays a Popup for the lobby
 * @returns {ReactElement}
 */
function Lobby() {
    return (
        <div id="lobby" className='popup'>
            <h1>Lobby Popup</h1>
            <Link to='/lobby'>
                <button>Create</button>
            </Link>
            <Link to='/lobby'>
                <button>Join</button>
            </Link>
        </div>
    );
}

export default Lobby;