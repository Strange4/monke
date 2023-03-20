import { Server } from "socket.io"

export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } })
    let userDict = {}
    let roomState = {}

    io.on("connection", (socket) => {
        const userData = setUserData(socket)

        const roomCode = socket.handshake.query.roomCode
        userDict[roomCode] = userDict[roomCode] || []

        setUpLobbyListeners(socket, userData, roomCode, roomState, userDict, io)
        setUpGameListeners(socket, userData, roomCode, roomState, userDict, io)
    });
}

function setUpLobbyListeners(socket, userData, roomCode, roomState, userDict, io) {
    socket.on("try-join", () => {
        if (roomState[roomCode] === "started") {
            socket.emit("game-started")
        } else if (userDict[roomCode].length < 2) {
            socket.join(roomCode);
            userDict[roomCode].push(userData)
            io.to(roomCode).emit("join-room", userDict[roomCode], roomCode)
        } else {
            socket.emit("full-room")
        }
    })

    socket.on("try-start", () => {
        roomState[roomCode] = "started"
        io.to(roomCode).emit("start-game", userDict[roomCode], roomCode)
    })

    socket.on("disconnect", () => {
        userDict[roomCode] = userDict[roomCode].filter(user => user.id !== userData.id)
        io.to(roomCode).emit("leave-room", userDict[roomCode], roomCode)
        socket._cleanup()
    })
}

function setUpGameListeners(socket, userData, roomCode, roomState, userDict, io) {
    socket.on("send-progress", (currentProgress, total) => {
        let userIndex = userDict[roomCode].findIndex(user => user.id === userData.id)
        userDict[roomCode][userIndex].progress = currentProgress / total * 100

        let endGame = true;
        userDict[roomCode].forEach(user => {
            if (user.progress < 100) {
                endGame = false
            } else {
                user.gameEnded = true
                if (user.id === userData.id) {
                    socket.emit("user-ended")
                }
            }
        });

        if (endGame) {
            io.to(roomCode).emit("end-game", userDict[roomCode])
        }
        io.to(roomCode).emit("update-progress", userDict[roomCode])
    });

    socket.once("send-results", (result) => {
        let userIndex = userDict[roomCode].findIndex(user => user.id === userData.id)
        userDict[roomCode][userIndex].results = result
        io.to(roomCode).emit("update-results", userDict[roomCode])
    })
}

function setUserData(socket) {
    const defaultAvatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    let userData = { username: "", id: "", avatar: "" }

    userData["username"] = socket.handshake.auth.userData?.username || "GUEST"
    userData["avatar"] = socket.handshake.auth.userData?.avatar || defaultAvatar
    userData["id"] = socket.id
    userData["progress"] = 0

    return userData
}
