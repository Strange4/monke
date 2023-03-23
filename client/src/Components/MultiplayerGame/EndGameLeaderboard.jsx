import { useContext } from "react";
import SocketContext from "../../Context/SocketContext";
import EndGameResults from "./EndGameResults";

function EndGameLeaderboard() {
    const socketContext = useContext(SocketContext)

    return (
        <div id="end-game-leaderboard">
            <h1> END OF GAME </h1>
            {socketContext.userList.map((user, i) => {
                return <EndGameResults
                    rank={i}
                    key={i} name={user.username}
                    avatar={user.avatar}
                    ended={user.gameEnded}
                    wpm={user.results?.wpm}
                    acc={user.results?.accuracy}
                />
            })}
        </div>
    );
}

export default EndGameLeaderboard;