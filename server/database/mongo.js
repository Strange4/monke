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
        let conn = await mongoose.connect(dbUrl, {dbName: "QuotesDatabase"});
        return conn;
    } catch (err) {
        throw new Error("Could not connect" + err);
    }
}

export default connectToDatabase;
