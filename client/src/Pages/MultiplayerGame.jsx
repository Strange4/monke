import './Styles/MultiplayerGame.css';
import NavBar from "../Components/NavBar";
import TypingScreen from "../Components/TypingScreen/TypingScreen";
import PlayerItem from '../Components/PlayerItem';
import SocketContext from '../Context/SocketContext';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import GameProgress from '../Components/MultiplayerGame/GameProgress';
import EndGameLeaderboard from '../Components/MultiplayerGame/EndGameLeaderboard';
import { LocationContext } from '../Context/LocationContext';
import AuthContext from '../Context/AuthContext';
import { postData } from '../Controller/FetchModule';

const MultiplayerGame = () => {
    const navigate = useNavigate();
    const locationContext = useContext(LocationContext);
    const socketContext = useContext(SocketContext);
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const [ended, setEnded] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);


    useEffect(() => {
        if (!locationContext.validAccess) {
            navigate("/")
        }
    }, [locationContext.validAccess]);

    useEffect(() => {
        if (socketContext.socket.current) {
            updateListeners();
        }
    }, []);

    /**
     * Updates the current lobby listeners and calls
     * a function that sets up new ones for gameplay
     */
    function updateListeners() {
        socketContext.socket.current.off("join-room");
        socketContext.socket.current.off("leave-room");
        socketContext.socket.current.on("leave-room", (users) => {
            socketContext.userList = users;
        });
        setUpProgressListeners();
    }

    /**
     * Sets all the progress in game listeners
     */
    function setUpProgressListeners() {
        socketContext.socket.current.on("update-progress", (userList) => {
            socketContext.userList = userList;
            let index = userList.findIndex(user => user.id === socketContext.socket.current.id);
            if (userList[index].progress >= 100) {
                setEnded(true);
            }
        });
        socketContext.socket.current.off("update-leaderboard");
        socketContext.socket.current.once("update-leaderboard", (newLeaderboard) => {
            setLeaderboard(newLeaderboard.sort((a, b) => sortLeaderboard(a, b)));
            if (authContext.userLoggedIn) {
                const index = newLeaderboard.
                    findIndex(user => user.id === socketContext.socket.current.id);
                const stats = {}
                if (index === 0) {
                    stats.win = true;
                } else {
                    stats.lose = true;
                }
                postData("/api/user_stat", stats, "PUT");
            }
        });
    }

    /**
     * Sorts the users in multiplayer game according to their score
     * @param {Object} a 
     * @param {Object} b 
     * @returns {Number}
     */
    function sortLeaderboard(a, b) {
        if (!a.results || !a.gameEnded) {
            return 1;
        } else if (!b.results || !b.gameEnded) {
            return -1;
        }
        return b.results.wpm * b.results.accuracy - a.results.wpm * a.results.accuracy;
    }

    return (
        <>
            < NavBar />
            {ended ?
                <EndGameLeaderboard leaderboard={leaderboard} />
                :
                <div id="multiplayer-game">
                    <div id="popup-root" />
                    <div id="playing-players">
                        {socketContext.userList.map((user, i) => {
                            return <PlayerItem
                                key={i} name={user.username}
                                avatar={user.avatar} leader={i === 0} />
                        })}
                    </div>
                    <GameProgress />
                    <TypingScreen multiplayer={true} quote={location.state?.quote || ""} />
                </div>
            }
        </>
    );
}

export default MultiplayerGame;