import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents Quotes
 */
const QuoteSchema = new Schema({
    // The person who uploads
    user: {type: Schema.Types.ObjectId, ref: "User"},
    quote: { type: String, required: true },
    // The person who created the quote
    author: String, 
    media: {type: String, required: true} 
});

const Quote = mongoose.model("Quote", QuoteSchema);
export default Quote;