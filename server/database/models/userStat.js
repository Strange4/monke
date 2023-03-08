import mongoose from "mongoose";
import { Constraints } from "../validation.js";
import { z } from "zod";

const Schema = mongoose.Schema;

/**
 * Schema that represents UserStats
 */
const UserStatSchema = new Schema({
    max_wpm: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.positiveInt(any)) },
    wpm: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.positiveNumber(any)) },
    max_accuracy: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.percentage(any)) },
    accuracy: { type: Number, default: 0, required: true,validate: (any) => !isNaN(Constraints.percentage(any))  },
    games_count: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.positiveInt(any)) },
    win: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.positiveInt(any)) },
    lose: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.positiveInt(any)) },
    draw: { type: Number, default: 0, required: true, validate: (any) => !isNaN(Constraints.positiveInt(any)) },
    date: { type: Date, default: () => new Date(), required: true, validate: Constraints.date },
});

export default UserStatSchema;