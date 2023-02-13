import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
/**
 * connects to the database and returns the connection
 * Throws error if the connection to the db can't be made
 */
let connectToDatabase = async () => {
    let conn;
    try{
        mongoose.set('strictQuery', true);
        conn = await mongoose.connect(dbUrl, {dbName: "QuotesDatabase"});
    } catch (err) {
        throw new Error("Could not connect");
    }
    return conn;
}

export default connectToDatabase;