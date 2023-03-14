import { Server } from "socket.io"
import { v4 } from "uuid";

const defaultAvatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"

export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } })
    let userDict = {}

    io.on("connection", (socket) => {
        let roomCode = socket.handshake.query.roomCode
        let userData = { username: "", id: "", avatar: "" }

        userData["username"] = socket.handshake.auth.userData?.username || "GUEST"
        userData["avatar"] = socket.handshake.auth.userData?.avatar || defaultAvatar
        userData["id"] = v4()

        socket.join(roomCode);

        if (!userDict[roomCode]) {
            userDict[roomCode] = []
        }

        socket.on("try-join", () => {
            if (userDict[roomCode].length < 2) {
                userDict[roomCode].push(userData)
                io.to(roomCode).emit("join-room", userDict[roomCode], roomCode)
            } else {
                socket.emit("full-room")
            }
        })

        socket.on("disconnect", () => {
            userDict[roomCode] = userDict[roomCode].filter(user => user.id !== userData.id)
            io.to(roomCode).emit("leave-room", userDict[roomCode], roomCode)
            socket._cleanup()
        })
    });

}
