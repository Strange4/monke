import React, {useState} from "react";
import {Link} from 'react-router-dom';

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
        <Link to="/lobby">Lobby</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
    </div>
  )
}

export default NavBar;