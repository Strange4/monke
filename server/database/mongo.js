import mongoose from "mongoose";
import dotenv from "dotenv";
import Quote from "./models/quote.js"
import UserStat from "./models/userStat.js";
import Picture from "./models/picture.js";
import User from "./models/user.js"
dotenv.config();

const dbUrl = process.env.ATLAS_URI;
const CONNECTED = 1;
const DB_NAME = "QuotesDatabase";

const QUOTE = 1;
const USER = 2;
const USER_STAT = 3;
const PIC = 4;

let instance;

/**
 * Database class that uses mongoose to connect to a mongodb atlas database.
 * Contains functions to connect to a database and check connection status.
 */
class Database {

    constructor(){
        if (!instance){
            instance = this;
        }
        return instance;
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
     * returns true if online connection to database is established.
     * If false reconnect and return whether it is connected or not.
     * @returns boolean
     */
    async isConnected() {
        if(mongoose.connection.readyState === CONNECTED){
            return true;
        }
        await this.connectToDatabase();
        return mongoose.connection.readyState === CONNECTED ? true : false;
    }

    /**
     * Generic find query for all models, will return one or many records
     * based on given query options.
     * @param {number} selects the model to use 
     * @param {*} queryOptions 
     * @returns 
     */
    async find(model, queryOptions){
        let result;
        // eslint-disable-next-line default-case
        switch(model){
        case 1: 
            result = await Quote.find(queryOptions);
            break;
        case 2:
            result = await User.find(queryOptions);
            break;
        case 3:
            result = await UserStat.find(queryOptions);
            break;
        case 4:
            result = await Picture.find(queryOptions);
        }
        return result;
    }

    /**
     * Generic findOne method for all models, will return only one record.
     * @param {number} used to select which model to run a query
     * @param {object} json representation of query fields for mongoDB 
     * @returns
     */
    async findOne(model, queryOptions){
        let result;
        // eslint-disable-next-line default-case
        switch(model){
        case QUOTE: 
            result = await Quote.findOne(queryOptions);
            break;
        case USER:
            console.log("querying user");
            result = await User.findOne(queryOptions);
            console.log(result);
            break;
        case USER_STAT:
            result = await UserStat.findOne(queryOptions);
            break;
        case PIC:
            result = await Picture.findOne(queryOptions);
        }
        return result;
    }

    /**
     * Generic findOneAndUpdate function for all models
     * @param {number} used to select which mode to run a query
     * @param {object} json representation of query fields for mongoDB 
     * @param {object} json data to update an existing record
     */
    async findOneAndUpdate(model, filter, update) {
        // eslint-disable-next-line default-case
        switch(model){
        case QUOTE: 
            result = await Quote.findOneAndUpdate(filter, update);
            break;
        case USER:
            result = await User.findOneAndUpdate(filter, update);
            break;
        case USER_STAT:
            result = await UserStat.findOneAndUpdate(filter, update);
            break;
        case PIC:
            result = await Picture.findOneAndUpdate(filter, update);
        }
    }
}

export default Database;
export { QUOTE, USER, USER_STAT, PIC };