import { Server, Socket } from "socket.io"

/**
 * Initial connnection set up
 * @param {Server} server 
 */
export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
    let userDict = {};
    let roomState = {};

    io.on("connection", (socket) => {
        const userData = setUserData(socket);

        const roomCode = socket.handshake.query.roomCode;
        userDict[roomCode] = userDict[roomCode] || [];

        setUpLobbyListeners(socket, userData, roomCode, roomState, userDict, io);
        setUpGameListeners(socket, userData, roomCode, userDict, io);
    });
}

/**
 * Sets up the lobby socket listeners and is in charge of handling
 * access to the room (full room or game started or available)
 * @param {Socket} socket 
 * @param {Object} userData 
 * @param {String} roomCode 
 * @param {String} roomState 
 * @param {Object} userDict 
 * @param {Server} io 
 */
function setUpLobbyListeners(socket, userData, roomCode, roomState, userDict, io) {
    socket.on("try-join", () => {
        if (roomState[roomCode] === "started") {
            socket.emit("game-started");
        } else if (userDict[roomCode].length < 5) {
            socket.join(roomCode);
            userDict[roomCode].push(userData);
            io.to(roomCode).emit("join-room", userDict[roomCode], roomCode);
        } else {
            socket.emit("full-room");
        }
    });

    socket.on("try-start", () => {
        roomState[roomCode] = "started";
        io.to(roomCode).emit("start-game", userDict[roomCode], roomCode);
    });

    //TODO make sure the disconnect cleans up everything
    socket.on("disconnect", () => {
        userDict[roomCode] = userDict[roomCode].filter(user => user.id !== userData.id);
        io.to(roomCode).emit("leave-room", userDict[roomCode], roomCode);
        socket._cleanup();
    });
}

/**
 * Sets up the in game socket listeners
 * @param {Socket} socket 
 * @param {Object} userData 
 * @param {String} roomCode 
 * @param {Object} userDict 
 * @param {Server} io 
 */
function setUpGameListeners(socket, userData, roomCode, userDict, io) {
    socket.on("update-progress-bar", (currentProgress, total) => {
        let userIndex = userDict[roomCode].findIndex(user => user.id === userData.id);
        userDict[roomCode][userIndex].progress = currentProgress / total * 100;

        // keeps track on whether that user finished the game or not
        userDict[roomCode].forEach(user => {
            if (user.progress >= 100) {
                user.progress = 100;
                user.gameEnded = true;
                if (user.id === userData.id) {
                    socket.emit("user-ended");
                }
            }
        });

        io.to(roomCode).emit("update-progress", userDict[roomCode]);
    });

    // executes once user has ended to update the results for that user
    socket.once("send-results", (result) => {
        let userIndex = userDict[roomCode].findIndex(user => user.id === userData.id);
        userDict[roomCode][userIndex].results = result;
        io.to(roomCode).emit("update-progress", userDict[roomCode]);
    });
}

/**
 * Sets the ID, username, avatar and progress for the user
 * associater with the given socket
 * @param {Socket} socket 
 * @returns {Object}
 */
function setUserData(socket) {
    const defaultAvatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    let userData = { username: "", id: "", avatar: "" };

    userData["username"] = socket.handshake.auth.userData?.username || "GUEST";
    userData["avatar"] = socket.handshake.auth.userData?.avatar || defaultAvatar;
    userData["id"] = socket.id;
    userData["progress"] = 0;

    return userData;
}
