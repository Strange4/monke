import supertest from "supertest";
import app from "../routes/app";
import mockingoose from "mockingoose";

import Quote from "../database/models/quote";
import User from "../database/models/user";

const REQUEST = supertest(app);

const API_ROUTE = "/api";

const SUCCESS = 200;
const ERROR = 400;

const TEST_USERS = [
    {
        username: "nice person",
        picture_url: "https://itsnotreal.org/images/2",
        email: "nice@mail.com",
        user_stats: {
            max_wpm: 150,
            wpm: 122,
            max_accuracy: 100,
            accuracy: 89,
            games_count: 10,
            win: 10,
            lose: 0,
            draw: 0,
            date: Date.now()
        }
    },
    {
        username: "bad person",
        picture_url: "https://itsnotreal.org/images/2",
        email: "notnice@mail.com",
        user_stats: {
            max_wpm: 120,
            wpm: 79,
            max_accuracy: 100,
            accuracy: 77,
            games_count: 10,
            win: 0,
            lose: 10,
            draw: 0,
            date: Date.now()
        }
    },
    {
        username: "joe",
        picture_url: "https://notareallink/images/none",
        email: "123aaaa@gmail.com",
        user_stats: {
            max_wpm: 150,
            wpm: 122,
            max_accuracy: 100,
            accuracy: 89,
            games_count: 10,
            win: 10,
            lose: 0,
            draw: 0,
            date: Date.now()
        }
    }
];

describe("GET /api/quote", () => {
    mockingoose(Quote).toReturn({ "quote": "weeeeeeeeeeeeeeeeeeee"}, "findOne");
    it("set difficulty to 1, must return a message with status code 200", async () => {
        mockingoose(Quote).toReturn({ "quote": "baaahh"}, "findOne");
    
        const RESPONSE = await REQUEST.get("/quote?difficulty=1");
    
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.body).toBeDefined();
    });

    it("set undefined difficulty, must return a message with status code 200", async () => {
        const RESPONSE = await REQUEST.get("/quote");
        
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.body).toBeDefined();
    });

    it("set 'a' for difficulty, must return a message with status code 400", async () => {
        const RESPONSE = await REQUEST.get("/quote?difficulty=nepnep");
        
        expect(RESPONSE.status).toBe(ERROR);
    });
});


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
    it("enter an email and receive a user+stats with code 200", async () => {
        // result for user
        mockingoose(User).toReturn(
            TEST_USERS[0],
            "findOne"
        );
        // result for rank
        mockingoose(User).toReturn(
            5, "countDocuments"
        );
        const RESPONSE = await REQUEST.post(ENDPOINT_URL).send({email: "123aaaa@gmail.com"});
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
                email: "meraha@muhooha.com",
                username: "derphdd",
                picture_url: "https://food.com/image/tacos"
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
        user.picture_url !== undefined  &&
        user.email !== undefined
    ){
        return true;
    }
    return false;
}