import supertest from "supertest";
import app from "../routes/app";
import mockingoose from "mockingoose";

import Quote from "../database/models/quote";
import User from "../database/models/user";
import UserStat from "../database/models/userStat";

const REQUEST = supertest(app);

const API_ROUTE = "/api";

const SUCCESS = 200;
const ERROR = 400;

describe("GET /api/quote", () => {
    test("set difficulty to 1, must return a message with status code 200", async () => {
        mockingoose(Quote).toReturn({ "quote": "baaahh"});
    
        const body = {"difficulty": "1"}
        const RESPONSE = await REQUEST.get(API_ROUTE + "/quote").send(body);
    
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.body).toBeDefined();
    });

    test("set difficulty to A, must return an error message with status code 400", async () => {
        const body = {"difficulty": "A"}
        const RESPONSE = await REQUEST.get(API_ROUTE + "/quote").send(body);
    
        expect(RESPONSE.status).toBe(ERROR);
        expect(RESPONSE.body.error).toBeDefined();
    });

    test("set undefined difficulty, must return a message with status code 200", async () => {
        const body = {"difficulty": undefined}

        mockingoose(Quote).toReturn([
            {"quote":"string1"},
            {"quote":"string2"},
            {"quote":"string3"},
            {"quote":"string4"},
            {"quote":"string5"}
        ]);

        const RESPONSE = await REQUEST.get(API_ROUTE + "/quote").send(body);
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.body).toBeDefined();
    });
});


describe("GET /api/leaderboard", () => {
    test("return a user array with status code 200", async () => {
        mockingoose(User).toReturn([
            {   _id:'640120a4a08a238b74bc9466',
                username:"nice person",
                picture_url:"https://cdns-images.dzcdn.net/images/cover/8dc87ca382ee183b4639fa79339…",
                email:"nice@mail.com",
                user_stats:'640120a4a08a238b74bc9464',
                __v:0
            }
        ]);

        mockingoose(UserStat).toReturn(
            {
                _id:'640120a4a08a238b74bc9464',
                max_wpm: 0,
                wpm: 0,
                max_accuracy: 420,
                games_count: 524,
                win: 0,
                lose: 987,
                draw: 3,
                __v:0
            }
        );

        const RESPONSE = await REQUEST.get(API_ROUTE + "/leaderboard").send();
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body[0].username).toBeDefined();
    });
});