import express from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';
import { getQuote } from '../controller/mongoHelper.js';

export const quoteRouter = express.Router();


quoteRouter.get("/", async (req, res, next) => {
    if(!req.query.difficulty){
        const quote = await getQuote();
        res.json({ body: quote });
        return;
    }
    let difficulty = req.query.difficulty;
    try{
        difficulty = z.number().gte(1).int().lte(5);
    } catch(_){
        const error = new createHttpError.BadRequest("the type of difficulty must be a number from 1 to 5");
        next(error);
    }
    const quote = await getQuote(difficulty);
    res.json({ body: quote });
});