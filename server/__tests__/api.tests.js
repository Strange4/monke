import app from "../routes/app";
import session from "express-session";
import mockingoose from "mockingoose";
import express from 'express';
import supertest from 'supertest';
import User from "../database/models/user";

const mockApp = express();
mockApp.use(session({
    secret: "not-very",
    name: 'id',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 120000,
        secure: false,
        httpOnly: true,
        sameSite: 'strict'
    }
}));
mockApp.all("*", (req, _, next) => {
    req.session.email = "nice@mail.com";
    next();
});
mockApp.use(app);
const REQUEST = supertest(mockApp);
const API_ROUTE = "/api";

export const SUCCESS = 200;
export const ERROR = 400;

const TEST_USERS = [
    {
        username: "nice person",
        "picture_url": "https://itsnotreal.org/images/2",
        "user_stats": {
            "max_wpm": 150,
            wpm: 122,
            "max_accuracy": 100,
            accuracy: 89,
            "games_count": 10,
            win: 10,
            lose: 0,
            draw: 0,
            date: Date.now()
        }
    },
    {
        username: "bad person",
        "picture_url": "https://itsnotreal.org/images/2",
        "user_stats": {
            "max_wpm": 120,
            wpm: 79,
            "max_accuracy": 100,
            accuracy: 77,
            "games_count": 10,
            win: 0,
            lose: 10,
            draw: 0,
            date: Date.now()
        }
    },
    {
        username: "joe",
        "picture_url": "https://notareallink/images/none",
        "user_stats": {
            "max_wpm": 150,
            wpm: 122,
            "max_accuracy": 100,
            accuracy: 89,
            "games_count": 10,
            win: 10,
            lose: 0,
            draw: 0,
            date: Date.now()
        }
    }
];



describe("GET /api/leaderboard", () => {
    it("return a user array with status code 200", async () => {
        mockingoose(User).toReturn(TEST_USERS);

        const RESPONSE = await REQUEST.get(API_ROUTE + "/leaderboard").send();
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(validateUser(RESPONSE.body[0])).toBe(true);
        expect(validateUser(RESPONSE.body[1])).toBe(true);
        expect(validateUsrStats(RESPONSE.body[0].user_stats)).toBe(true);
        expect(validateUsrStats(RESPONSE.body[1].user_stats)).toBe(true);
        expect(RESPONSE.body[0].user_stats.max_wpm >= RESPONSE.body[1].user_stats.max_wpm)
            .toBe(true);
    });
});

describe("POST /api/user", () => {
    const ENDPOINT_URL = API_ROUTE + "/user";
    it("send a request and receive a user+stats with code 200", async () => {
        // result for user
        mockingoose(User).toReturn(
            TEST_USERS[2],
            "findOne"
        );
        // result for rank
        mockingoose(User).toReturn(
            5, "countDocuments"
        );
        const RESPONSE = await REQUEST.post(ENDPOINT_URL).send();
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.rank).toBeDefined();
        expect(validateUser(RESPONSE.body)).toBe(true);
        expect(validateUsrStats(RESPONSE.body.user_stats)).toBeDefined();
    });

    it("create a new user, returns status code 200", async () => {
        // null = you don't exist
        mockingoose(User).toReturn(null, "findOne");
        const RESPONSE = await REQUEST.post(ENDPOINT_URL).send(
            {
                username: "derphdd",
                "picture_url": "https://food.com/image/tacos"
            }
        );
        expect(RESPONSE.status).toBe(SUCCESS);
    });
});


/**
 * validate if user_stats fields are all defined
 * @param {object} userStats representation of user's stats
 * @returns 
 */
function validateUsrStats(userStats){
    if(
        userStats.max_wpm !== undefined      &&
        userStats.wpm !== undefined          &&
        userStats.max_accuracy !== undefined &&
        userStats.accuracy !== undefined     &&
        userStats.games_count !== undefined  &&
        userStats.win !== undefined          &&
        userStats.lose !== undefined         &&
        userStats.draw !== undefined         &&
        userStats.date !== undefined
    ){
        return true;
    }
    return false;
}

/**
 * validate if user fields are all defined
 * @param {object} user 
 * @returns 
 */
function validateUser(user){
    if(
        user.username !== undefined     &&
        user.picture_url !== undefined
    ){
        return true;
    }
    return false;
}