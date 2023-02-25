import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
const DISCONNECTED = 0;
const CONNECTED = 1;
const DB_NAME = "QuotesDatabase";

/**
 * Database class that uses mongoose to connect to a mongodb atlas database.
 * Contains functions to connect to a database and check connection status.
 */
class Database {
    constructor(){
        // immediately establish a connection with the database if disconnected
        if(this.isConnected() === DISCONNECTED){
            this.connectToDatabase(); 
        }
    }

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
     * returns true if online connection to database is established:
     * @returns boolean
     */
    isConnected() {
        return mongoose.connection.readyState === CONNECTED ? true : false
    }
}

export default Database;