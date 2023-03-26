import { useContext, useState, useEffect } from "react";
import SocketContext from "../../Context/SocketContext";
import EndGameResults from "./EndGameResults";
import { postData } from "../../Controller/FetchModule";

function EndGameLeaderboard() {
    const socketContext = useContext(SocketContext)
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        socketContext.socket.current.off("update-leaderboard")
        socketContext.socket.current.once("update-leaderboard", (leaderboard) => {
            setLeaderboard(leaderboard)
            let leaderboardIndex = 
                leaderboard.findIndex(user => user.id === socketContext.socket.current.id)
            if (leaderboard[leaderboardIndex].email) {
                let stats = {
                    email: leaderboard[leaderboardIndex].email
                }
                if (leaderboardIndex === 0) {
                    stats.win = true;
                } else {
                    stats.lose = true;
                }
                postData("/api/user_stat", stats, "PUT");
            }
        });
    }, []);
    
    return (
        <div id="end-game-leaderboard">
            <h1> END OF GAME </h1>
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
                    />
                })
            }
        </div>
    );
}

export default EndGameLeaderboard;