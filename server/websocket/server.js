import { Server } from "socket.io";
import { validate as uuidValidate } from 'uuid';
import { getRandomQuote } from "../routes/quotes.js";

const lobbies = {};
const MAX_USERS = 3
const COLORS = ["green", "red", "blue", "yellow", "orange"];

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
    const NODE_ENV = process.env.NODE_ENV || "production";
    const option = NODE_ENV === "development" ? 
        { cors: { origin: "http://localhost:3000" } } : undefined;
    const io = new Server(server, option);

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
        if (lobby.users.length < MAX_USERS) {
            socket.join(roomCode);
            lobby.users.push(userData);
            io.to(roomCode).emit("join-room", lobby.users, roomCode);
            return;
        }
        socket.emit("invalid", "ROOM FULL, enter a different room");
    });

    socket.on("try-start", async () => {
        lobby.users.forEach((user, i) => {
            user.color = COLORS[i]
        })
        lobby.startRoom();
        let quote = await getRandomQuote();
        io.to(roomCode).emit("start-game", quote);
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
    socket.on("update-progress-bar", (progress) => {
        let userIndex = lobby.users.findIndex(user => user.id === userData.id);
        lobby.users[userIndex].progress = progress;
        // keeps track on whether that user finished the game or not
        if (lobby.users[userIndex].progress >= 100) {
            lobby.users[userIndex].progress = 100;
            lobby.users[userIndex].gameEnded = true;
        }
        io.to(roomCode).emit("update-progress", lobby.users);
    });

    // executes once user has ended to update the results for that user
    socket.once("send-results", (result) => {
        //TODO double check
        // io.to(roomCode).emit("update-progress", lobby.users);
        let leaderboardIndex = lobby.leaderboard.findIndex(user => user.id === userData.id);
        lobby.leaderboard[leaderboardIndex].results = result;
        lobby.leaderboard[leaderboardIndex].gameEnded = true;
        checkGameEnded(lobby, roomCode, io);
        io.to(roomCode).emit("update-progress", lobby.users);
    });
}

/**
 * only display the end game leaderboard if everyone finished
 * @param {Object} userDict 
 * @param {String} roomCode
 * @param {Server} io 
 */
function checkGameEnded(lobby, roomCode, io) {
    let displayLeaderboard = lobby.users.every(user => user.gameEnded);
    if (displayLeaderboard) {
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
    userData["avatar"] = socket.handshake.auth.userData?.avatar || defaultAvatar;
    userData["id"] = socket.id;
    userData["progress"] = 0;
    return userData;
}
