import { useContext } from "react";
import SocketContext from "../../Context/SocketContext";
import EndGameResults from "./EndGameResults";
import { checkUser } from "../../Controller/GameResultsHelper";

function EndGameLeaderboard(props) {
    const socketContext = useContext(SocketContext);

    return (
        <div id="end-game-leaderboard">
            <h1> GAME RESULTS </h1>
            {props.leaderboard.length === 0 ?
                <p> GAME STILL IN PROGRESS</p>
                :
                props.leaderboard.map((user, i) => {
                    return <EndGameResults
                        rank={i} key={i}
                        name={user.username}
                        avatar={user.avatar}
                        ended={user.gameEnded}
                        wpm={user.results?.wpm}
                        acc={user.results?.accuracy}
                        myUser={checkUser(user, socketContext.socket.current)}
                    />
                })
            }
        </div>
    );
}

export default EndGameLeaderboard;