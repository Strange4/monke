import { useContext } from "react";
import SocketContext from "../../Context/SocketContext";
import EndGameResults from "../../Pages/EndGameResults";

function EndGameLeaderboard() {
    
    const socketContext = useContext(SocketContext)

    function sortGameLeaderboard(a, b) {
        // console.log("sorting")
        if (a.results === undefined || b.results === undefined) {
            return 1
        } else if (a.results.wpm * a.results.acc > b.results.wpm * b.results.acc) {
            return 1;
        } else if (a.results.wpm * a.results.acc < b.results.wpm * b.results.acc) {
            return -1;
        } else {
            return 0;
        }
    }

    return (
        <div id="end-game-leaderboard">
            <h1> END OF GAME </h1>
            {socketContext.userList.sort(
                (a, b) => sortGameLeaderboard(a, b)
            ).map((user, i) => {
                return <EndGameResults
                    key={i} name={user.username}
                    avatar={user.avatar}
                    wpm={user.results?.wpm}
                    acc={user.results?.accuracy}
                />
            })}
        </div>
    );
}

export default EndGameLeaderboard;