import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents UserStats
 */
const UserStatSchema = new Schema({
    user: {type : Schema.Types.ObjectId, ref: "User"},
    wpm: Number,
    accuracy: Number,
    games: Number,
    win: Number,
    lose: Number,
    draw: Number,
    rank: Number
});

const UserStat = mongoose.model("UserStat", UserStatSchema);
export default UserStat;