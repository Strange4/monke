import './Styles/NavBar.css';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';
import Lobby from './Lobby';
import Login from './Login';
import Profile from '../Pages/Profile';
import AuthContext from '../Context/AuthContext';
// import * as AuthHelper from '../Controller/AuthHelper'

import { useContext } from "react";

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar(props) {
    const auth = useContext(AuthContext);

    async function handleLogout() {
        console.log("logging out")
        await fetch("/authentication/logout");
        auth.setUserData({
            username: "",
            email: "",
            picture: ""
        })
        auth.setLoginStatus(false)
    }

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
                <Popup trigger={<Link to="/profile">Profile</Link>}>
                    <Profile />
                </Popup>
            </li>
            <li>
                {console.log(auth)}
                <Popup trigger={<a> {props.loginStatus ? "Logout" : "Login"}</a>}>
                    {
                        props.loginStatus ?
                            <button onClick={handleLogout}> Logout </button>
                            :
                            <Login />
                    }
                </Popup>
            </li>
        </div >
    );
}

export default NavBar;