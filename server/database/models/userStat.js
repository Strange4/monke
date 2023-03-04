import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents UserStats
 */
const UserStatSchema = new Schema({
    "max_wpm": { type: Number, default: 0, required: true },
    "wpm": { type: Number, default: 0, required: true },
    "max_accuracy": { type: Number, default: 0, required: true },
    "accuracy": { type: Number, default: 0, required: true },
    "games_count": { type: Number, default: 0, required: true },
    "win": { type: Number, default: 0, required: true },
    "lose": { type: Number, default: 0, required: true },
    "draw": { type: Number, default: 0, required: true }
});

const UserStat = mongoose.model("UserStat", UserStatSchema);
export default UserStat;