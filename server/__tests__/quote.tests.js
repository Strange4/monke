import Quote from "../database/models/quote";
import supertest from "supertest";
import app from "../routes/app";
import mockingoose from "mockingoose";
import { SUCCESS, ERROR } from "./api.tests";
const REQUEST = supertest(app);

describe("Testing the quotes api endpoint", () => {
    describe("GET /api/quote", () => {
        mockingoose(Quote).toReturn({ "quote": "weeeeeeeeeeeeeeeeeeee"}, "findOne");
        
        it("set with no params, must return a message with status code 200", async () => {
            const RESPONSE = await REQUEST.get("/api/quote");
            
            expect(RESPONSE.status).toBe(SUCCESS);
            expect(RESPONSE.body.body).toBeDefined();
        });

        it("set a medium length, the quote should be defined", async () => {
            const RESPONSE = await REQUEST.get("/api/quote?quoteLength=medium");
            expect(RESPONSE.status).toBe(SUCCESS);
            expect(RESPONSE.body.body).toBeDefined();
        });
        
        it("set random for length, must return a message with status code 400", async () => {
            const RESPONSE = await REQUEST.get("/api/quote?quoteLength=nepnep");
            expect(RESPONSE.status).toBe(ERROR);
        });
    });
});