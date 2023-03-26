import { Server } from "socket.io";
import { validate as uuidValidate } from 'uuid';

const lobbies = {};

class Lobby {
    users = []
    roomState = "stopped"
    leaderboard = []

    startRoom() {
        this.roomState = "started";
    }
}

/**
 * Initial connnection set up
 * @param {Server} server 
 */
export function setUp(server) {
    const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
    
    io.on("connection", (socket) => {
        const userData = setUserData(socket);
        const roomCode = socket.handshake.query.roomCode;
        lobbies[roomCode] = lobbies[roomCode] || new Lobby();

        setUpLobbyListeners(socket, userData, roomCode, lobbies[roomCode], io);
        setUpGameListeners(socket, userData, roomCode, lobbies[roomCode], io);
    });
}

/**
 * Sets up the lobby socket listeners and is in charge of handling
 * access to the room (full room or game started or available)
 * @param {Socket} socket 
 * @param {Object} userData 
 * @param {String} roomCode 
 * @param {Lobby} lobby
 * @param {Server} io 
 */
function setUpLobbyListeners(socket, userData, roomCode, lobby, io) {
    socket.on("try-join", () => {
        if (!uuidValidate(roomCode)) {
            socket.emit("invalid", "INVALID ROOM CODE, try again");
            return;
        }
        if (lobby.roomState === "started") {
            socket.emit("invalid", "GAME ALREADY STARTED, cannot join the room");
            return;
        } 
        if (lobby.users.length < 3) {
            socket.join(roomCode);
            lobby.users.push(userData);
            io.to(roomCode).emit("join-room", lobby.users, roomCode);
            return;
        } 
        socket.emit("invalid", "ROOM FULL, enter a different room");
    });

    socket.on("try-start", () => {
        lobby.startRoom();
        io.to(roomCode).emit("start-game", lobby.users, roomCode);
        lobby.leaderboard = [...lobby.users];
    });

    socket.on("start-countdown", () => {
        io.to(roomCode).emit("countdown", lobby.users, roomCode);
    });

    socket.on("disconnect", () => {
        lobby.users = lobby.users.filter(user => user.id !== userData.id);
        io.to(roomCode).emit("leave-room", lobby.users, roomCode);
        checkGameEnded(lobby, roomCode, io);
        if (lobby.users.length === 0) {
            delete lobbies[roomCode];
        }
    });
}

/**
 * Sets up the in game socket listeners
 * @param {Socket} socket 
 * @param {Object} userData 
 * @param {String} roomCode 
 * @param {Lobby} lobby
 * @param {Server} io 
 */
function setUpGameListeners(socket, userData, roomCode, lobby, io) {
    socket.on("update-progress-bar", (currentProgress, total) => {
        let userIndex = lobby.users.findIndex(user => user.id === userData.id);
        lobby.users[userIndex].progress = currentProgress / total * 100;

        // keeps track on whether that user finished the game or not
        lobby.users.forEach(user => {
            if (user.progress >= 100) {
                user.progress = 100;
                if (user.id === userData.id && !user.gameEnded) {
                    socket.emit("user-ended");
                }
                user.gameEnded = true;
            }
        });
        io.to(roomCode).emit("update-progress", lobby.users);
    });

    // executes once user has ended to update the results for that user
    socket.once("send-results", async (result) => {
        io.to(roomCode).emit("update-progress", lobby.users);
        let userIndex = lobby.leaderboard.findIndex(user => user.id === userData.id);
        lobby.leaderboard[userIndex].results = result;
        await checkGameEnded(lobby, roomCode, io);
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
async function checkGameEnded(lobby, roomCode, io) {
    let displayLeaderboard = lobby.users.every(user => user.gameEnded);

    if (displayLeaderboard) {
        lobby.leaderboard.sort((a, b) => sortLeaderboard(a, b));
        io.to(roomCode).emit("update-leaderboard", lobby.leaderboard);
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
