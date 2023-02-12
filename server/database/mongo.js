import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
let conn = null;
/**
 * connects to the database and returns the connection
 * Throws error if the connection to the db can't be made
 */
const getDBConnection = async () => {
    if(conn === null){
        mongoose.set('strictQuery', true);
        conn = await mongoose.connect(dbUrl, {dbName: "QuotesDatabase"});
    }
    return conn;
}

export default getDBConnection;