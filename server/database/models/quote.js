import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const quoteFields = {
    quote: { type: String, required: true },
    difficulty: {type: Number, required: true},
    "number_characters": Number,
    "number_special_characters": Number,
    "number_words": Number,
    "average_word_length": Number
}
/**
 * Schema that represents Quotes
 */
const QuoteSchema = new Schema(quoteFields);

const Quote = mongoose.model("Quote", QuoteSchema);
export default Quote;