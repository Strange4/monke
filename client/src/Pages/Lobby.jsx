import './Styles/Lobby.css';
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/MultiplayerGame/PlayerItem';
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { BiCopy } from 'react-icons/bi';
import { RiCheckDoubleFill } from 'react-icons/ri';
import SocketContext from '../Context/SocketContext';
import Chronometer, { useChronometer } from '../Components/TypingScreen/Chronometer';
import { LocationContext } from '../Context/LocationContext';
import { checkUser } from '../Controller/GameResultsHelper';

function Lobby() {
    const roomCode = useRef();
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const socketContext = useContext(SocketContext);
    const locationContext = useContext(LocationContext);
    const navigate = useNavigate();

    const [started, setStarted] = useState(false);
    const [displayTime, setDisplayTime] = useState(0);
    const { startTimer, stopTimer } = useChronometer(setDisplayTime);

    useEffect(() => {
        if (!locationContext.validAccess) {
            navigate("/");
        }
    }, [locationContext.validAccess]);

    useEffect(() => {
        if (!socketContext.socket.current) {
            navigate("/");
        } else {
            socketContext.socket.current.off("invalid");
            socketContext.socket.current.on("countdown", () => {
                startTimer();
                setStarted(true);
            });
        }
    }, []);

    useEffect(() => {
        if (displayTime === 3) {
            stopTimer();
            socketContext.socket.current.emit("try-start");
        }
    }, [displayTime]);

    // Copies the code to the clipboard through click
    function copyCode(e) {
        e.target.disabled = true;
        navigator.clipboard.writeText(roomCode.current.textContent);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            e.target.disabled = false;
        }, 1000);
    }

    // Disconnect the socket and navigate back to the home page
    function leave(e) {
        e.target.disabled = true;
        socketContext.socket.current.disconnect();
        socketContext.socket.current = undefined;
        navigate("/");
    }

    // Tell all users in lobby to start the countdown 
    function startGame(e) {
        e.target.disabled = true;
        socketContext.socket.current.emit("start-countdown");
    }

    return (
        <div id="home">
            <NavBar />
            <div id="lobby-info">
                {started ?
                    <Chronometer id="countdown" seconds={3 - displayTime || "GO"} />
                    :
                    <>
                        <div id="players">
                            {socketContext.userList.map((user, i) => {
                                return <PlayerItem
                                    key={i} name={user.username}
                                    avatar={user.avatar} leader={i === 0}
                                    myUser={checkUser(user, socketContext.socket.current)} />
                            })}
                            <p ref={roomCode} id="invite-code">
                                {location.state?.roomCode}
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
                    </>
                }
            </div>
            <div id="practice">
                <div id="popup-root" />
                <TypingScreen multiplayer={false} practice={true} punctuation={true}
                    quoteLength={"random"} id='lobby-game' />
            </div>
        </div>
    );
}

export default Lobby;