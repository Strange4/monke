import z from "zod";


// user validation 
const userSchema = z.object({
    "username": z.string(),
    "picture_url": z.string()
});

//user stats validation
const userStatSchema = z.object({
    user: {type : Schema.Types.ObjectId, ref: "User"},
    "max_wpm": Number,
    wpm: Number,
    "max_accuracy": Number,
    accuracy: Number,
    "games_count": Number,
    win: Number,
    lose: Number,
    draw: Number,
    date: Date
});

export {userSchema, userStatSchema};