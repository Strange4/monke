import './Styles/NavBar.css';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';
import LobbyPopup from './MultiplayerGame/Lobby/LobbyPopup';
import Preferences from './Preferences/Preferences';
import Login from './Login';
import logo from "../Assets/keyboard-champions-logo/svg/logo-no-background.svg"
import { GiCrenelCrown } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { HiCog, HiUserGroup } from "react-icons/hi"
import AuthContext from '../Context/AuthContext';
import { useContext, useState } from "react";
    import { SecureLink } from './SecureNavigation/SecureLink';

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar() {
    const auth = useContext(AuthContext);
    const [showPref, setShowPref] = useState(false);

    function toggleShowPref() {
        setShowPref(!showPref);
    }

    async function handleLogout() {
        await fetch("/authentication/logout");
        auth.setUserLoggedIn(false);
    }

    return (
        <div id="navbar">
            <div id="nav-sub">
                <li>
                    <SecureLink to="/">
                        <img src={logo} id="logo"></img>
                    </SecureLink>
                </li>
                <li>
                    <Popup trigger={<a><GiCrenelCrown id="leaderboard-icon" /></a>} modal>
                        <Leaderboard />
                    </Popup>
                </li>
                <li>
                    <Popup trigger={<a><HiUserGroup id="lobby-icon" /></a>} modal>
                        <LobbyPopup />
                    </Popup>
                </li>
                <li>
                    <HiCog onClick={toggleShowPref} id="pref-icon" />
                    {showPref ?
                        <Preferences open={showPref} toggleShow={toggleShowPref} /> : null}
                </li>
            </div>
            <li>
                <Popup trigger={<a><CgProfile id="profile-icon" /></a>} >
                    {auth.userLoggedIn ?
                        <div className='access'>
                            <SecureLink to='/profile'>
                                <button className='logged-in'>Profile</button>
                            </SecureLink>
                            <SecureLink to='/'>
                                <button onClick={handleLogout} className='logged-in'>
                                    Logout
                                </button>
                            </SecureLink>
                        </div>
                        : ""}
                    {
                        auth.userLoggedIn ? null :
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