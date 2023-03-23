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
        console.log("Oh shit got a parsing error");
        const error = new createHttpError.BadRequest(zodError);
        console.log("bad to the bone");
        next(error);
        return;
    }
    console.log(query);
    const total = await Quote.countDocuments(query);
    const quote = await Quote.findOne(query).skip(randomInt(0, total - 1)).lean();
    // there are no quotes with query
    if(quote === null){
        console.log("There are no quotes with those params")
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
    const difficulty = queryParams.difficulty ? z.number()
        .int().gte(1).lte(5)
        .parse(Number(queryParams.difficulty))
        : undefined;
    const length = queryParams.quoteLength ? z.string()
        .regex(/(short|medium|long)/)
        .parse(queryParams.quoteLength)
        : undefined;
    const quoteLengthQuery = {
        short: {$lte: shortQuoteLength},
        medium: {$gt: shortQuoteLength, $lte: mediumQuoteLength},
        long: {$gt: mediumQuoteLength}
    }[length];
    return {
        ...difficulty && {difficulty}, 
        ...quoteLengthQuery && {"number_characters": quoteLengthQuery}};
}

async function getRandomQuote(){
    const total = await Quote.count();
    const quote = await Quote.findOne().skip(randomInt(0, total - 1)).lean();
    if(!quote){
        throw new Error("there are no quotes in the db");
    }
    return quote.quote;
}