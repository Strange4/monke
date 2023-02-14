import z, { nullable, object } from "zod";
import mongoose from "mongoose";


// user validation 
const userSchema = z.object({
    "username": z.string(),
    "picture_url": z.string()
});

//user stats validation
const userStatSchema = z.object({
    user: object,
    "max_wpm": z.number().positive(),
    wpm: z.number().positive(),
    "max_accuracy": z.number(),
    accuracy: z.number(),
    "games_count": z.number(),
    win: z.number(),
    lose: z.number(),
    draw: z.number(),
    date: z.date().nullable(true)
});

export {userSchema, userStatSchema};