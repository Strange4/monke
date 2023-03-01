import './Styles/NavBar.css';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaderboard from './Leaderboard';
import Lobby from './Lobby';
import Login from './Login';
import AuthContext from '../Context/AuthContext';
import { useContext } from "react";

/**
 * Navigation bar to be used on all pages
 * @returns {ReactElement}
 */
function NavBar(props) {
    const auth = useContext(AuthContext);

    async function handleLogout() {
        await fetch("/authentication/logout");
        auth.setUserEmail("")
        auth.setLoginStatus(false);
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
                <Link to="/profile">Profile</Link>
            </li>
            <li>
                <Popup trigger={<a> {props.loginStatus === true ?
                    <button onClick={handleLogout}> Logout </button> : "Login"}</a>}>
                    {
                        props.loginStatus === true ? null :
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