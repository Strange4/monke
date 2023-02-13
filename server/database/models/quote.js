import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents Quotes
 */
const QuoteSchema = new Schema({
    quote: { type: String, required: true },
    difficulty: {type: Number, required: true}
});

const Quote = mongoose.model("Quote", QuoteSchema);
export default Quote;