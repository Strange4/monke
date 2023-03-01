import './Styles/NavBar.css';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';
import Lobby from './Lobby';
import Login from './Login';
import logo from "../Assets/keyboard-champions-logo/svg/logo-no-background.svg"
import { GiCrenelCrown } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar() {
    return (
        <div id="navbar">
            <li>
                <Link to="/">
                    <img src={logo} id="logo"></img>
                </Link>
            </li>
            <div id="nav-sub">
                <li>
                    <Popup trigger={<a><GiCrenelCrown id="leaderboard-icon"/></a>} modal>
                        <Leaderboard />
                    </Popup>
                </li>
                <li>
                    <Popup trigger={<a>Lobby</a>} modal>
                        <Lobby />
                    </Popup>
                </li>
            </div>

            <li>
                {/* popup and link work at same time for now, 
                will be changed to show right one depending on login status */}
                <Popup trigger={<Link to="/profile"><CgProfile id="profile-icon"/></Link>}>
                    <Login />
                </Popup>
            </li>
        </div>
    );
}

export default NavBar;