import express from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';
import Quote from '../database/models/quote.js';
import { randomInt } from './util.js';

export const quoteRouter = express.Router();


quoteRouter.get("/", async (req, res, next) => {
    const total = await Quote.count();
    if(!req.query.difficulty){
        const quote = await Quote.findOne().skip(randomInt(0, total - 1)).lean();
        console.log(quote);
        res.json({ body: quote.quote });
        return;
    }
    const difficulty = req.query.difficulty;
    try{
        difficulty = z.number().gte(1).int().lte(5);
    } catch(_){
        const error = new createHttpError.BadRequest("the type of difficulty must be a number from 1 to 5");
        next(error);
    }
    const quote = await Quote.findOne({difficulty}).skip(randomInt(0, total)).lean();
    res.json({ body: quote });
});