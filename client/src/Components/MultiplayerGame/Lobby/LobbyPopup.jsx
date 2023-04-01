import './Styles/LobbyPopup.css';
import '../../Styles/Popup.css';
import { useContext, useRef } from 'react';
import AuthContext from '../../../Context/AuthContext';
import * as FetchModule from "../../../Controller/FetchModule";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SocketContext from '../../../Context/SocketContext';
import { GiRetroController } from 'react-icons/gi';

/**
 * Displays a Popup for the lobby
 * @returns {ReactElement}
 */
function LobbyPopup() {
    const roomCode = useRef();
    const feedback = useRef();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const socketContext = useContext(SocketContext);

    /**
     * Joins the lobby at the given room code
     * @param {Event} e 
     */
    const joinLobby = async (e) => {
        e.target.disabled = true;
        await setUpSocket(roomCode.current.value, e.target);
    }

    /**
     * Creates a lobby with a new room code
     * @param {Event} e 
     */
    const createLobby = async (e) => {
        e.target.disabled = true;
        let newRoomCode = await FetchModule.fetchData("/api/lobby");
        if (newRoomCode) {
            await setUpSocket(newRoomCode, e.target);
        }
    }

    /**
     * Disconnects the socket and sets it to undefined
     */
    function disconnectSocket() {
        socketContext.socket.current.disconnect();
        socketContext.socket.current = undefined;
    }

    /**
     * Updates the current room to reflect the user join/leave changes
     * @param {Object} users 
     * @param {String} roomCode 
     */
    function updateRoom(users, roomCode) {
        socketContext.userList = users;
        navigate("/lobby", { state: { roomCode: roomCode } });
    }

    /**
     * Sets up the socket listeners for basic lobby actions
     * @param {*} joinButton 
     */
    function setSocketListeners(joinButton) {
        socketContext.socket.current.on("join-room", (users, roomCode) => {
            updateRoom(users, roomCode);
        });
        socketContext.socket.current.on("leave-room", (users, roomCode) => {
            updateRoom(users, roomCode);
        });
        socketContext.socket.current.on("invalid", (invalidMessage) => {
            feedback.current.textContent = invalidMessage;
            disconnectSocket();
            if (joinButton) {
                joinButton.disabled = false;
            }
        });
        socketContext.socket.current.on("start-game", (quote) => {
            navigate("/multiplayer-game", { state: { quote: quote } });
        });
    }

    /**
     * Sets up the socket and sets the user data
     * @param {String} roomCode 
     * @param {*} joinButton 
     */
    async function setUpSocket(roomCode, joinButton) {
        if (socketContext.socket.current) {
            disconnectSocket();
        }
        let userData = {
            avatar: "",
            username: ""
        };
        if (auth.userLoggedIn) {
            const url = "/api/user";
            const data = await FetchModule.postData(url, undefined, "POST");
            if (data) {
                userData["avatar"] = data.picture_url;
                userData["username"] = data.username;
            }
        }
        socketContext.socket.current = io("", {
            query: { roomCode: roomCode }, auth: { userData }
        });
        setSocketListeners(joinButton);
        socketContext.socket.current.emit("try-join");
    }

    return (
        <div id="lobby" className='popup'>
            <GiRetroController id='lobby-filler-1' />
            <GiRetroController id='lobby-filler-2' />
            <h1 id='lobby-header'>Multiplayer</h1>
            <div id='create-btn-container'>
                <button 
                    onClick={async (e) => await createLobby(e)}
                    className='lobby-access'>
                    Create
                </button>
            </div>

            <div id='room-code-input'>
                <input ref={roomCode} type="text" name="code" placeholder='Enter room code...' />
                <button onClick={async (e) => await joinLobby(e)}>Enter game</button>
            </div>
            <p ref={feedback}></p>
        </div>
    );
}

export default LobbyPopup;