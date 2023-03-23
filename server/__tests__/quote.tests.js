import Quote from "../database/models/quote";
import supertest from "supertest";
import app from "../routes/app";
import mockingoose from "mockingoose";
import { SUCCESS, ERROR } from "./api.tests";
const REQUEST = supertest(app);

describe("Testing the quotes api endpoint", () => {
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

        it("set difficulty as 10, must return a status of 400", async () => {
            const RESPONSE = await REQUEST.get("/quote?difficulty=10");
            expect(RESPONSE.status).toBe(ERROR);
        });
    });
});