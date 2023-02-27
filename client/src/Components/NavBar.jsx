import './Styles/NavBar.css';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';
import Lobby from './Lobby';
import Login from './Login';

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar() {
    return (
        <div id="navbar">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Popup trigger={<a>Leaderboard</a>} modal>
                    <Leaderboard />
                </Popup>
            </li>
            <li>
                <Popup trigger={<a>Lobby</a>} modal>
                    <Lobby />
                </Popup>
            </li>
            <li>
                {/* popup and link work at same time for now, 
                will be changed to show right one depending on login status */}
                <Popup trigger={<Link to="/profile">Profile</Link>}>
                    <Login />
                </Popup>
            </li>
        </div>
    );
}

export default NavBar;