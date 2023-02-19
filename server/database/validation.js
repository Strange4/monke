import z, { nullable, object } from "zod";
import mongoose from "mongoose";


// user validation 
const userSchema = z.object({
    "username": z.string(),
    "picture_url": z.string()
});

//user stats validation
const userStatSchema = z.object({
    "max_wpm": z.number().nonnegative(),
    "wpm": z.number().nonnegative(),
    "max_accuracy": z.number().nonnegative(),
    "accuracy": z.number().nonnegative(),
    "games_count": z.number().int().nonnegative(),
    "win": z.number().int().nonnegative(),
    "lose": z.number().int().nonnegative(),
    "draw": z.number().int().nonnegative(),
    //"date": z.date().nullable()
});

export {userSchema, userStatSchema};