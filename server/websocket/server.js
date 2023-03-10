import { createServer } from "http"
import { Server } from "socket.io"
import app from "../routes/app"

const httpServer = createServer(app)
const io = new Server(httpServer, {cors: {origin: "http://localhost:3000"}})

io.on("connection", (socket) => {
    console.log("hi")
    console.log(socket.id)
    socket.on("join-room", (roomID, userEmail) => {
        console.log(roomID)
    })
});
