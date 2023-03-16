import '../Components/Lobby/Styles/Lobby.css'
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import LobbySettings from '../Components/Lobby/LobbySettings';
import { AiFillSetting } from "react-icons/ai"
import PlayerItem from '../Components/PlayerItem';
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import SocketContext from '../Context/SocketContext';

function Lobby() {
    const navigate = useNavigate()
    const roomCode = useRef()
    const location = useLocation()
    const [settings, showSettings] = useState(false);
    const [userList, setUserList] = useState(location.state.users)
    const socketContext = useContext(SocketContext)

    useEffect(() => {
        if (location.pathname !== "/lobby") {
            socketContext.socket.current.disconnect()
            socketContext.socket.current = undefined
        }
    }, [location]);

    const handleClick = () => {
        showSettings(current => !current)
    }

    function copyCode() {
        navigator.clipboard.writeText(roomCode.current.textContent)
    }

    useEffect(() => {
        setUserList(location.state.users)
    }, [location.state.users])

    function leave() {
        socketContext.socket.current.disconnect()
        socketContext.socket.current = undefined
        navigate("/")
    }

    return (
        <div id="home">
            <NavBar />
            <div id="lobby-info">
                <div id="players">
                    {userList.map((user, i) => {
                        return <PlayerItem key={i} name={user.username} avatar={user.avatar} />
                    })}
                    <p ref={roomCode} id="invite-code">
                        {location.state.roomCode}
                        <BiCopy id="copy-icon" onClick={copyCode} />
                    </p>
                </div>
                <div id="action-buttons">
                    <Link to="/multiplayer-game">
                        <button id="play-btn">PLAY</button>
                    </Link>
                    <button id="leave-btn" onClick={leave}>LEAVE</button>
                </div>

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