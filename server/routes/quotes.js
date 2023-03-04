import express from 'express';
import createHttpError from 'http-errors';
import { getQuote } from '../controller/mongoHelper.js';

export const quoteRouter = express.Router();


quoteRouter.get("/", async (req, res, next) => {
    if(!req.query.difficulty){
        const quote = await getQuote();
        res.json({ body: quote });
        return;
    }
    const difficulty = Number(req.query.difficulty);
    if(isNaN(difficulty)){
        const error = new createHttpError.BadRequest("the type of difficulty must be a number");
        next(error);
        return;
    }
    if(difficulty < 1 || difficulty > 5){
        const error = new createHttpError.BadRequest("the range of the difficulty must be from 1 to 5");
        next(error);
        return;
    }
    const quote = await getQuote(difficulty);
    res.json({ body: quote });
});