import express from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';
import Quote from '../database/models/quote.js';
import { randomInt } from '../controller/util.js';

export const quoteRouter = express.Router();
export const shortQuoteLength = 100;
export const mediumQuoteLength = 250;

quoteRouter.get("/", async (req, res, next) => {
    let query;
    try{
        query = getUriParams(req.query);
    } catch(zodError){
        const error = new createHttpError.BadRequest(zodError);
        next(error);
    }
    const total = await Quote.countDocuments(query);
    const quote = await Quote.findOne(query).skip(randomInt(0, total - 1)).lean();
    // there are no quotes with query
    if(quote === null){
        res.json({body: await getRandomQuote() });
        return;
    }
    res.json({ body: quote.quote });
});

/**
 * 
 * @param {import('express-serve-static-core').Query} queryParams
* @returns {import('mongoose').FilterQuery<import("../database/models/quote").quoteFields>}
 */
function getUriParams(queryParams){
    const difficulty = z.number()
        .gte(1)
        .int().lte(5).parse(queryParams.difficulty);
        
    const length = z.string()
        .regex(/(short|medium|long)/)
        .parse(queryParams.quoteLength);
    const quoteLengthQuery = {
        short: {"number_characters": {$lte: shortQuoteLength}},
        medium: {"number_characters": {$gt: shortQuoteLength, $lte: mediumQuoteLength}},
        long: {"number_characters": {$gt: mediumQuoteLength}}
    }[length];
    return {difficulty, "number_characters": quoteLengthQuery};
}

async function getRandomQuote(){
    const total = await Quote.count();
    const quote = await Quote.findOne().skip(randomInt(0, total - 1)).lean();
    if(!quote){
        throw new Error("there are no quotes in the db");
    }
    return quote.quote;
}