/**
 * @file Module contains helper methods to query and manipulate
 * database records.
 * @author Christopher Hu
 */

import Database from "../database/mongo.js"
import { QUOTE, USER, USER_STAT } from "../database/mongo.js"

let db = new Database();

/**
 * Function will query database for quotes with given difficulty then
 * pick and return one quote randomly from resulting list.
 * If said list is length of 1, return that single quote.
 * @param {number} difficultyVal : represents difficulty level of desired quotes (1 to 5 inclusive)
 * @returns Object, is a json that holds the body of the quote.
 */
async function getQuote(difficultyVal) {
    let quotes;

    if (db.isConnected()) {
        // selects all quotes if difficultyVal is undefined otherwise query by difficulty
        quotes = difficultyVal === undefined ?
            await db.find(QUOTE) : await db.find(QUOTE, { difficulty: difficultyVal });

        if (quotes.length > 0) {
            const quoteIndex = quotes.length > 1 ?
                Math.floor(Math.random() * quotes.length) : 0;
            return quotes[quoteIndex].quote
        }
        return "There are no quotes available with that difficulty."
    }
    return "The database is currently down so make do with this quote instead."
}

/**
 * Get the Id of the User then return the UserStats of the User.
 * @param {string} name, username of the new User. 
 * @returns boolean depending on if the username exists or not. 
 */
async function getUserStats(email) {
    try {
        const databaseUser = await db.findOne(USER, { email: email });
        if (databaseUser !== null) {
            const stats = await db.findOne(USER_STAT, { _id: databaseUser.user_stats });
            return stats;
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * Check to see in the database if the username exists or not.
 * @param {string} email, email of the new User. 
 * @returns boolean depending on if the email exists or not. 
 */
async function checkEmail(newEmail) {
    try {
        const emailQuery = await db.findOne(USER, { email: newEmail });
        if (emailQuery !== null) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

export { getQuote, getUserStats, checkEmail };