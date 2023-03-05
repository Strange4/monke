import './Styles/Lobby.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import GameSettings from "../Components/GameSettings";
import { AiFillSetting } from "react-icons/ai"
import PlayerItem from '../Components/PlayerItem';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

    const [settings, showSettings] = useState(false);

    const handleClick = () => {
        
        showSettings(current => !current)
    }

    return (
        <div id="home">
            <NavBar />
            <div id="lobby-info">
                <div id="players">
                    {/* tobe replaced with a dynamic list as players join */}
                    <PlayerItem name="Name"/>
                    <PlayerItem name="Name"/>
                    <PlayerItem name="Name"/>
                    <PlayerItem name="Name"/>
                    <PlayerItem name="Name"/>

                    <button id="invite-btn">INVITE</button>
                </div>
                <Link to="/multiplayer-game">
                    <button id="play-btn">PLAY</button>
                </Link>
                {settings && <GameSettings id="lobby-settings"/> }
                <AiFillSetting id="lobby-settings-icon" onClick={handleClick}/>
            </div>

            <div id="practice">
                <TypingScreen />
            </div>
        </div>
    );
}

export default Home;