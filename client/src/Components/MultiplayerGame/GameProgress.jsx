import { useContext, useEffect, useState } from "react";
import SocketContext from "../../Context/SocketContext";
import UserProgress from "./UserProgress";

function GameProgress() {
    const socketContext = useContext(SocketContext);
    const [users, setUsers] = useState(socketContext.userList);

    useEffect(() => {
        if (socketContext.socket.current) {
            socketContext.socket.current.on("update-progress", (userList) => {
                setUsers(userList);
            });
        }
    }, []);

    return (
        <div id="game-progress">
            {
                users.map((user, i) => {
                    return <UserProgress
                        key={i} index={i} progress={Math.round(user.progress)} />
                })
            }
        </div>
    );
}

export default GameProgress;