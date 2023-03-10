import './Styles/Lobby.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import LobbySettings from '../Components/LobbySettings';
import { AiFillSetting } from "react-icons/ai"
import PlayerItem from '../Components/PlayerItem';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi'

function Lobby() {

    const [settings, showSettings] = useState(false);
    const location = useLocation()
    // add state to handle wheter a user is the lobby creator
    // Will show additional info/settings if they are

    const handleClick = () => {
        showSettings(current => !current)
    }

    return (
        <div id="home">
            <NavBar />
            <div id="lobby-info">
                <div id="players">
                    {/* to be replaced with a dynamic list as players join */}
                    <PlayerItem name="Name" />
                    <PlayerItem name="Name" />
                    <PlayerItem name="Name" />
                    <PlayerItem name="Name" />
                    <PlayerItem name="Name" />

                    {/* icon will have a copy function to copy the lobby code */}
                    <p id="invite-code">{location.state.roomCode}<BiCopy id="copy-icon" /></p>

                </div>
                <Link to="/multiplayer-game">
                    <button id="play-btn">PLAY</button>
                </Link>
                {settings && <LobbySettings />}
                <AiFillSetting id="lobby-settings-icon" onClick={handleClick} />
            </div>

            <div id="practice">
                <TypingScreen />
            </div>
        </div>
    );
}

export default Lobby;