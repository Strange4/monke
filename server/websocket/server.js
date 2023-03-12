import { Server } from "socket.io"

export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } })
    let userList = []

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
        userList.push({username: userData.username})
        io.to(roomCode).emit("join-room", userList)
    });
}
