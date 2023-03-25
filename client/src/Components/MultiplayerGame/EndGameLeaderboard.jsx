import { useContext, useState, useEffect } from "react";
import SocketContext from "../../Context/SocketContext";
import EndGameResults from "./EndGameResults";

function EndGameLeaderboard() {
    const socketContext = useContext(SocketContext)
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        socketContext.socket.current.on("update-leaderboard", (leaderboard) => {
            setLeaderboard(leaderboard)
        });

    }, [])

    useEffect(() => {
        console.log(leaderboard)
    }, [leaderboard])

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