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
    positiveNumber: (any) => {
        return catchFunction(() => z.number().nonnegative().parse(any));
    },
    positiveInt: (any) => {
        return catchFunction(() => z.number().nonnegative().int().parse(any));
    }
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