import z, { nullable, object } from "zod";
import mongoose from "mongoose";


// user validation 
const userSchema = z.object({
    "username": z.string(),
    "picture_url": z.string()
});

//user stats validation
const userStatSchema = z.object({
    "max_wpm": z.number().nonnegative().optional(),
    "wpm": z.number().nonnegative(),
    "max_accuracy": z.number().nonnegative().optional(),
    "accuracy": z.number().nonnegative(),
    "games_count": z.number().int().nonnegative(),
    "win": z.number().int().nonnegative(),
    "lose": z.number().int().nonnegative(),
    "draw": z.number().int().nonnegative(),
    //"date": z.date().nullable()
});

export const Constraints = {
    positiveNumber: (any) => !isNaN(z.number().nonnegative().parse(any)),
    positiveInt: (any) =>  !isNaN(z.number().nonnegative().int().parse(any)),
    email: (any) => z.string().email().parse(any),
    url: (any) => z.string().url().parse(any),
    string: (any) => z.string().parse(any),
    percentage: (any) => !isNaN(z.number().nonnegative().lte(100).parse(any)),
}



/**
 * @template T 
 * @param {() => T} someFunction 
 * @returns {T | undefined}
 */
function catchFunction(someFunction){
    try{
        return someFunction()
    } catch(_){
        return undefined;
    }
}

export {userSchema, userStatSchema};