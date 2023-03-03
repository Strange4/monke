import supertest from "supertest";
import app from "../routes/app";
import mockingoose from "mockingoose";

import Quote from "../database/models/quote";

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