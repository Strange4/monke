import mongoose from "mongoose";
import { Constraints } from "../validation.js";
import { z } from "zod";

const Schema = mongoose.Schema;

/**
 * Schema that represents UserStats
 */
const UserStatSchema = new Schema({
    "max_wpm": { type: Number, default: 0, required: true, validate: Constraints.positiveInt },
    "wpm": { type: Number, default: 0, required: true, validate: Constraints.positiveNumber },
    "max_accuracy": { type: Number, default: 0, required: true, validate: Constraints.percentage },
    "accuracy": { type: Number, default: 0, required: true,validate: Constraints.percentage  },
    "games_count": { type: Number, default: 0, required: true, validate: Constraints.positiveInt },
    "win": { type: Number, default: 0, required: true, validate: Constraints.positiveInt },
    "lose": { type: Number, default: 0, required: true, validate: Constraints.positiveInt },
    "draw": { type: Number, default: 0, required: true, validate: Constraints.positiveInt }
});

const UserStat = mongoose.model("UserStat", UserStatSchema);
export default UserStat;