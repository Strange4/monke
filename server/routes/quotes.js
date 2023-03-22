import express from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';
import Quote from '../database/models/quote.js';
import { randomInt } from '../controller/util.js';

export const quoteRouter = express.Router();

quoteRouter.get("/", async (req, res, next) => {
    if(!req.query.difficulty){
        res.json({ body: await getRandomQuote() });
        return;
    }
    const difficulty = Number(req.query.difficulty);
    try{
        z.number().gte(1).int().lte(5).parse(difficulty);
    } catch(_){
        const error = new createHttpError.BadRequest("difficulty must be a number from 1 to 5");
        next(error);
    }
    const total = await Quote.countDocuments({difficulty});
    const quote = await Quote.findOne({difficulty}).skip(randomInt(0, total - 1)).lean();
    if(quote === null){
        
        res.json({body: await getRandomQuote() });
        return;
    }
    res.json({ body: quote.quote });
});

async function getRandomQuote(){
    const total = await Quote.count();
    const quote = await Quote.findOne().skip(randomInt(0, total - 1)).lean();
    if(!quote){
        throw new Error("there are no quotes in the db");
    }
    return quote.quote;
}