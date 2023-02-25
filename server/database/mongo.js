import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
const CONNECTED = 1;
const DB_NAME = "QuotesDatabase";

/**
 * Database class that uses mongoose to connect to a mongodb atlas database.
 * Contains functions to connect to a database and check connection status.
 */
class Database {

    /**
     * async method to establish a connection with the database.
     */
    async connectToDatabase () {
        try{
            mongoose.set('strictQuery', true);
            console.log(`Attempting to connect to database: ${DB_NAME}`);
            await mongoose.connect(dbUrl, { dbName: DB_NAME });
            console.log(`Connected to database: ${DB_NAME}`);
        } catch (err) {
            console.error("could not connect to server", err);
        }
    }

    /**
     * returns true if online connection to database is established.
     * If false reconnect and return whether it is connected or not.
     * @returns boolean
     */
    async isConnected() {
        // return mongoose.connection.readyState === CONNECTED ? true : false
        if(mongoose.connection.readyState === CONNECTED){
            return true;
        }
        await this.connectToDatabase();
        return mongoose.connection.readyState === CONNECTED ? true : false;
    }
}

export default Database;