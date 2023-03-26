import { Server } from "socket.io";
// import { postUserStats } from "../routes/api";
import fetch from "node-fetch"

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
        if (!validateRoom(roomCode)) {
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
        checkGameEnded(leaderboard, userDict, roomCode, io, socket, userData, false);
        if (userDict[roomCode].length === 0) {
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
    socket.once("send-results", async (result) => {
        io.to(roomCode).emit("update-progress", userDict[roomCode]);
        let userIndex = leaderboard[roomCode].findIndex(user => user.id === userData.id);
        leaderboard[roomCode][userIndex].results = result;
        await checkGameEnded(leaderboard, userDict, roomCode, io, socket, userData, true)
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
 * validates room code with regex pattern
 * @returns {boolean}
 */
function validateRoom(room) {
    const roomRegex = /^[A-Za-z0-9]+(?:[-][A-Za-z0-9]+)*$/;
    var validRoom = room.match(roomRegex);
    return validRoom !== null;
}

/**
 * only display the end game leaderboard if everyone finished
 * @param {Object} userDict 
 * @param {Server} io 
 */
async function checkGameEnded(leaderboard, userDict, roomCode, io, socket, userData, post) {
    let displayLeaderboard = true;
    userDict[roomCode].forEach(user => {
        if (!user.gameEnded) {
            displayLeaderboard = false;
        }
    });
    if (displayLeaderboard) {
        leaderboard[roomCode].sort((a, b) => sortLeaderboard(a, b));
        let leaderboardIndex = leaderboard[roomCode].findIndex(user => user.id === userData.id)
        let stats = {
            email: userData.email
        }
        if (leaderboardIndex === 0) {
            stats.win = 1;
        } else {
            stats.lose = 1;
        }
        io.to(roomCode).emit("update-leaderboard", leaderboard[roomCode], stats);
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
    userData["email"] = socket.handshake.auth.userData?.email || "";
    userData["avatar"] = socket.handshake.auth.userData?.avatar || defaultAvatar;
    userData["id"] = socket.id;
    userData["progress"] = 0;
    return userData;
}
