import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
/**
 * connects to the database and returns the connection
 * Throws error if the connection to the db can't be made
 */
const connectToDatabase = async () => {
    try{
        mongoose.set('strictQuery', true);
        await mongoose.connect(dbUrl, {dbName: "QuotesDatabase"});
    } catch (err) {
        throw new Error("Could not connect");
    }
}

export default connectToDatabase;