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
            let leaderboardIndex = leaderboard.findIndex(user => user.id === socketContext.socket.current.id)
            if (leaderboard[leaderboardIndex].email) {
                console.log("YEP")
                
                let stats = {
                    email: leaderboard[leaderboardIndex].email
                }
                if (leaderboardIndex === 0) {
                    stats.win = 1;
                } else {
                    stats.lose = 1;
                }
                console.log(stats)
                postData("/api/user_stat", stats, "PUT");
            } else {
                console.log("NOP")
                console.log(leaderboard[leaderboardIndex])
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