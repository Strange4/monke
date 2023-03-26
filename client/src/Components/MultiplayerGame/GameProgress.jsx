import { useContext } from "react";
import SocketContext from "../../Context/SocketContext";
import UserProgress from "./UserProgress";

function GameProgress() {
    const socketContext = useContext(SocketContext);

    return (
        <div id="game-progress">
            {
                socketContext.userList.map((user, i) => {
                    return <UserProgress
                        key={i} index={i} progress={Math.round(user.progress)} />
                })
            }
        </div>
    );
}

export default GameProgress;