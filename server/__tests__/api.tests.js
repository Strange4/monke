import supertest from "supertest";
import app from "../routes/app";
import mockingoose from "mockingoose";

import Quote from "../database/models/quote";
import User from "../database/models/user";
import UserStatSchema from "../database/models/userStat";

const REQUEST = supertest(app);

const API_ROUTE = "/api";

const SUCCESS = 200;
const ERROR = 400;

describe("GET /api/quote", () => {
    mockingoose(Quote).toReturn({ "quote": "weeeeeeeeeeeeeeeeeeee"}, "findOne");
    test("set difficulty to 1, must return a message with status code 200", async () => {
        mockingoose(Quote).toReturn({ "quote": "baaahh"}, "findOne");
    
        const RESPONSE = await REQUEST.get("/quote?difficulty=1");
    
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.body).toBeDefined();
    });

    test("set undefined difficulty, must return a message with status code 200", async () => {
        const RESPONSE = await REQUEST.get("/quote");
        
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.body).toBeDefined();
    });

    test("set 'a' for difficulty, must return a message with status code 400", async () => {
        const RESPONSE = await REQUEST.get("/quote?difficulty=nepnep");
        
        expect(RESPONSE.status).toBe(ERROR);
    });
});


// describe("GET /api/leaderboard", () => {
//     test("return a user array with status code 200", async () => {
//         mockingoose(User).toReturn([
//             {   
//                 username:"nice person",
//                 picture_url:"https://cdns-images.dzcdn.net/images/cover/8dc87ca382ee183b4639fa79339…",
//                 email:"nice@mail.com",
//                 user_stats:{}
    
//             }
//         ]);

//         const RESPONSE = await REQUEST.get(API_ROUTE + "/leaderboard").send();
//         expect(RESPONSE.status).toBe(SUCCESS);
//         expect(RESPONSE.body[0].username).toBeDefined();
//     });
// });

describe("POST /api/user", () => {
    const ENDPOINT_URL = API_ROUTE + "/user";
    const email = "123aaaa@gmail.com";
    const username = "joe";
    const pictureUrl = "https://notareallink/images/none"
    it("enter an email and receive a user+stats with code 200", async () => {
        // result for user
        mockingoose(User).toReturn(
            {
                username: username,
                picture_url: pictureUrl,
                email: email,
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
            "findOne"
        );
        // result for rank
        mockingoose(User).toReturn(
            5, "countDocuments"
        );
        const RESPONSE = await REQUEST.post(ENDPOINT_URL).send({email: "123aaaa@gmail.com"});
        expect(RESPONSE.status).toBe(SUCCESS);
        expect(RESPONSE.body.rank).toBeDefined();
        expect(RESPONSE.body.picture_url).toBeDefined();
        expect(RESPONSE.body.email).toBeDefined();
        expect(RESPONSE.body.username).toBeDefined();
        expect(RESPONSE.body.user_stats).toBeDefined();
    });

    it("create a new user, returns status code 200", async () => {
        // null = you don't exist
        mockingoose(User).toReturn(null, "findOne");
        const RESPONSE = await REQUEST.post(ENDPOINT_URL).send(
            {
                email: email,
                username: username,
                picture_url: pictureUrl
            }
        );
        expect(RESPONSE.status).toBe(SUCCESS);
    });
});