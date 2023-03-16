import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents Quotes
 */
const QuoteSchema = new Schema({
    "quote": { type: String, required: true },
    "difficulty": {type: Number, required: true},
    "number_characters": Number,
    "number_special_characters": Number,
    "number_words": Number,
    "average_word_length": Number
});

const Quote = mongoose.model("Quote", QuoteSchema);
export default Quote;