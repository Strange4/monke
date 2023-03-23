import '../Components/Lobby/Styles/Lobby.css';
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import LobbySettings from '../Components/Lobby/LobbySettings';
import { AiFillSetting } from "react-icons/ai";
import PlayerItem from '../Components/PlayerItem';
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import { RiCheckDoubleFill } from 'react-icons/ri';
import SocketContext from '../Context/SocketContext';

function Lobby() {
    const navigate = useNavigate();
    const roomCode = useRef();
    const location = useLocation();
    const [settings, showSettings] = useState(false);
    const [copied, setCopied] = useState(false);
    const socketContext = useContext(SocketContext);

    useEffect(() => {
        if (!socketContext.socket.current) {
            navigate("/");
        }
    }, []);

    // Toggle settings view
    const handleClick = () => {
        showSettings(current => !current);
    }

    // Copies the code to the clipboard through click
    function copyCode() {
        navigator.clipboard.writeText(roomCode.current.textContent);
        setCopied(true);
    }

    // Disconnect the socket and navigate back to the home page
    function leave() {
        socketContext.socket.current.disconnect();
        socketContext.socket.current = undefined;
        navigate("/");
    }

    // Checks with the server side if game can get started
    function startGame() {
        socketContext.socket.current.emit("try-start");
    }

    return (
        <div id="home">
            <NavBar />
            <div id="lobby-info">
                <div id="players">
                    {socketContext.userList.map((user, i) => {
                        return <PlayerItem
                            key={i} name={user.username}
                            avatar={user.avatar} leader={i === 0} />
                    })}
                    <p ref={roomCode} id="invite-code">
                        {location.state.roomCode}
                        {copied ?
                            <RiCheckDoubleFill id="copy-icon" />
                            :
                            <BiCopy id="copy-icon" onClick={copyCode} />}
                    </p>
                </div>
                <div id="action-buttons">
                    <button id="play-btn" onClick={startGame}>PLAY</button>
                    <button id="leave-btn" onClick={leave}>LEAVE</button>
                </div>

                {settings && <LobbySettings />}
                <AiFillSetting id="lobby-settings-icon" onClick={handleClick} />
            </div>

            <div id="practice">
                <TypingScreen multiplayer={false} />
            </div>
        </div>
    );
}

export default Lobby;