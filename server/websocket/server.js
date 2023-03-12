import { Server } from "socket.io"

export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } })

    io.on("connection", (socket) => {
        console.log("CONNECTED")
        
        if(socket.handshake.auth.userEmail) {
            console.log(`LOGGED IN as ${socket.handshake.auth.userEmail}`)
        } else {
            console.log("not logged in")
        }

        socket.on("join-room", (roomID, userEmail) => {
            console.log(roomID)
        })
    });
}
