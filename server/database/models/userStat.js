import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents UserStats
 */
const UserStatSchema = new Schema({
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

const UserStat = mongoose.model("UserStat", UserStatSchema);
export default UserStat;