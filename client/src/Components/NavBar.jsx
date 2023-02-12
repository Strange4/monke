import {Link} from 'react-router-dom';
import './styles/NavBar.css';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderborad';
import Lobby from './Lobby';

/**
 * Navigation bar to be used on all pages
 * @returns html
 */
const NavBar = () => {

    return(
        <div id="navbar">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Popup trigger={<a>Leaderboard</a>}>
                    <Leaderboard />
                </Popup>
            </li>
            <li>
                <Popup trigger={<a>Lobby</a>}>
                    <Lobby />
                </Popup>
            </li>
            <li>
                <Link to="/profile">Profile</Link>
            </li>
        </div>
    );
}

export default NavBar;