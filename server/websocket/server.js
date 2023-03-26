import { Server } from "socket.io";
import { validate as uuidValidate } from 'uuid';

/**
 * Initial connnection set up
 * @param {Server} server 
 */
export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
    let userDict = {};
    let roomState = {};
    let leaderboard = {};

    io.on("connection", (socket) => {
        const userData = setUserData(socket);

        const roomCode = socket.handshake.query.roomCode;
        userDict[roomCode] = userDict[roomCode] || [];
        leaderboard[roomCode] = leaderboard[roomCode] || [];

        setUpLobbyListeners(socket, userData, roomCode, roomState, userDict, io, leaderboard);
        setUpGameListeners(socket, userData, roomCode, userDict, io, leaderboard);
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
function setUpLobbyListeners(socket, userData, roomCode, roomState, userDict, io, leaderboard) {
    socket.on("try-join", () => {
        if (!uuidValidate(roomCode)) {
            socket.emit("invalid", "INVALID ROOM CODE, try again");
        }
        if (roomState[roomCode] === "started") {
            socket.emit("invalid", "GAME ALREADY STARTED, cannot join the room");
        } else if (userDict[roomCode].length < 5) {
            socket.join(roomCode);
            userDict[roomCode].push(userData);
            io.to(roomCode).emit("join-room", userDict[roomCode], roomCode);
        } else {
            socket.emit("invalid", "ROOM FULL, enter a different room");
        }
    });

    socket.on("try-start", () => {
        roomState[roomCode] = "started";
        io.to(roomCode).emit("start-game", userDict[roomCode], roomCode);
        leaderboard[roomCode] = [...userDict[roomCode]];
    });

    socket.on("start-countdown", () => {
        io.to(roomCode).emit("countdown", userDict[roomCode], roomCode);
    });

    socket.on("disconnect", () => {
        userDict[roomCode] = userDict[roomCode].filter(user => user.id !== userData.id);
        io.to(roomCode).emit("leave-room", userDict[roomCode], roomCode);
        checkGameEnded(leaderboard, userDict, roomCode, io);
        if(userDict[roomCode].length === 0) {
            delete userDict[roomCode];
            delete leaderboard[roomCode];
        }
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
function setUpGameListeners(socket, userData, roomCode, userDict, io, leaderboard) {
    socket.on("update-progress-bar", (currentProgress, total) => {
        let userIndex = userDict[roomCode].findIndex(user => user.id === userData.id);
        userDict[roomCode][userIndex].progress = currentProgress / total * 100;

        // keeps track on whether that user finished the game or not
        userDict[roomCode].forEach(user => {
            if (user.progress >= 100) {
                user.progress = 100;
                if (user.id === userData.id && !user.gameEnded) {
                    socket.emit("user-ended");
                }
                user.gameEnded = true;
            }
        });
        io.to(roomCode).emit("update-progress", userDict[roomCode]);
    });

    // executes once user has ended to update the results for that user
    socket.once("send-results", (result) => {
        io.to(roomCode).emit("update-progress", userDict[roomCode]);
        let userIndex = leaderboard[roomCode].findIndex(user => user.id === userData.id);
        leaderboard[roomCode][userIndex].results = result;
        checkGameEnded(leaderboard, userDict, roomCode, io)
    });
}

/**
 * Sorts the users in multiplayer game according to their score
 * @param {Object} a 
 * @param {Object} b 
 * @returns {Number}
 */
function sortLeaderboard(a, b) {
    if (!b.results || !a.results) {
        return 1;
    }
    return b.results.wpm * b.results.accuracy - a.results.wpm * a.results.accuracy;
}

/**
 * only display the end game leaderboard if everyone finished
 * @param {Object} userDict 
 * @param {Server} io 
 */
function checkGameEnded(leaderboard, userDict, roomCode, io) {
    let displayLeaderboard = true;
    userDict[roomCode].forEach(user => {
        if (!user.gameEnded) {
            displayLeaderboard = false;
        }
    });
    if (displayLeaderboard) {
        leaderboard[roomCode].sort((a, b) => sortLeaderboard(a, b));
        io.to(roomCode).emit("update-leaderboard", leaderboard[roomCode]);
    }
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
