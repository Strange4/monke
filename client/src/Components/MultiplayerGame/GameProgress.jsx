import { useContext, useEffect, useState } from "react";
import SocketContext from "../../Context/SocketContext";
import UserProgress from "./UserProgress";
import { GiTrophy } from 'react-icons/gi';

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
                users.sort((a, b) => b.progress - a.progress).map((user, i) => {
                    return <UserProgress
                        key={i} progress={Math.round(user.progress)} />
                })
            }
            <GiTrophy/>
        </div>
    );
}

export default GameProgress;