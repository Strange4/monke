import './Styles/NavBar.css';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';
import Lobby from './Lobby';
import Login from './Login';
import logo from "../Assets/keyboard-champions-logo/svg/logo-no-background.svg"
import { GiCrenelCrown } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { HiUserGroup } from "react-icons/hi"
import AuthContext from '../Context/AuthContext';
import { useContext } from "react";

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar() {
    const auth = useContext(AuthContext);

    async function handleLogout() {
        await fetch("/authentication/logout");
        auth.setUserEmail("")
    }

    return (
        <div id="navbar">
            <div id="nav-sub">

                <li>
                    <Link to="/">
                        <img src={logo} id="logo"></img>
                    </Link>
                </li>
                <li>
                    <Popup trigger={<a><GiCrenelCrown id="leaderboard-icon"/></a>} modal>
                        <Leaderboard />
                    </Popup>
                </li>
                <li>
                    <Popup trigger={<a><HiUserGroup id="lobby-icon"/></a>} modal>
                        <Lobby />
                    </Popup>
                </li>
            </div>
            <li>
                <Link to="/profile"><CgProfile id="profile-icon"/></Link>
            </li>
            <li>
                <Popup trigger={<a> 
                    {auth.userEmail ?
                        <button onClick={handleLogout}> Logout </button> : "Login"}
                </a>}>
                    {
                        auth.userEmail ? null :
                            <div>
                                <Login navbar={false} />
                            </div>
                    }
                </Popup>
            </li>
        </div>
    );
}

export default NavBar;