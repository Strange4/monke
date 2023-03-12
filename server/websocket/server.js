import { Server } from "socket.io"

export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } })
    let userDict = {}

    io.on("connection", (socket) => {
        console.log("CONNECTED")

        let roomCode = socket.handshake.query.roomCode
        let userData = { username: "" }

        if (socket.handshake.auth.userEmail) {
            console.log(`LOGGED IN as ${socket.handshake.auth.userEmail}`)
            userData["username"] = socket.handshake.auth.userEmail
        } else {
            //TODO set random name and picture here
            console.log("not logged in")
            userData["username"] = "GUEST"
        }

        socket.join(roomCode);

        if (!userDict[roomCode]) {
            userDict[roomCode] = []
        }

        userDict[roomCode].push(userData)
        io.to(roomCode).emit("change-room", userDict[roomCode])

        io.on("disconnect", (socket) => {
            console.log("DISCONNECT")
        })
    });

}
