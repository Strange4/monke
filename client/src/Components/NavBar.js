import {Link} from 'react-router-dom';
import './Styles/NavBar.css';
import Popup from 'reactjs-popup'
import Leaderboard from './Leaderborad';

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
        <Link to="/lobby">Lobby</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
    </div>
  )
}

export default NavBar;