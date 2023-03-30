import { useContext, useState, useEffect } from "react";
import SocketContext from "../../Context/SocketContext";
import EndGameResults from "./EndGameResults";
import { postData } from "../../Controller/FetchModule";
import AuthContext from "../../Context/AuthContext";

function EndGameLeaderboard() {
    const socketContext = useContext(SocketContext);
    const authContext = useContext(AuthContext);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        socketContext.socket.current.off("update-leaderboard");
        socketContext.socket.current.once("update-leaderboard", (leaderboard) => {
            console.log("HERE")
            setLeaderboard(leaderboard.sort((a, b) => sortLeaderboard(a, b)));
            if (authContext.userLoggedIn) {
                const index = leaderboard.
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
    }, []);

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

    /**
     * Checks if the displayed user is the current user
     * @param {Object} user 
     * @returns {Boolean}
     */
    function checkUser(user) {
        return user.id === socketContext.socket.current.id;
    }

    return (
        <div id="end-game-leaderboard">
            <h1> GAME RESULTS </h1>
            {leaderboard.length === 0 ?
                <p> GAME STILL IN PROGRESS</p>
                :
                leaderboard.map((user, i) => {
                    return <EndGameResults
                        rank={i}
                        key={i} name={user.username}
                        avatar={user.avatar}
                        ended={user.gameEnded}
                        wpm={user.results?.wpm}
                        acc={user.results?.accuracy}
                        myUser={checkUser(user)}
                    />
                })
            }
        </div>
    );
}

export default EndGameLeaderboard;