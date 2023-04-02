import * as FetchModule from "./FetchModule";

/**
 * Sends data to the post api for a user's solo game
 * @param {Object} result 
 */
export async function postUserStats(result) {
    const userStats = {
        wpm: result.wpm,
        accuracy: result.accuracy
    };

    FetchModule.postData("/api/user_stat", userStats, "PUT");
}

/**
 * Compute the results for the solo game upon end and post them
 */
export function computeResults(numberOfSeconds, text, typedText) {
    const numWords = text.split(" ").length;
    const minutes = numberOfSeconds / 60;
    const wpm = numWords / minutes;
    const result = {
        time: Math.round(numberOfSeconds * 100) / 100,
        wpm: Math.round(wpm * 100) / 100,
        accuracy: Math.round(computeAccuracy(typedText) * 100) / 100
    }
    return result;
}

/**
* computes the accuracy and returns it to the results computation
* @returns {number}
*/
function computeAccuracy(typedText) {
    let wrongCount = 0;
    let rightCount = 0;
    typedText.forEach(letter => {
        if (letter.type === "right") {
            ++rightCount;
        } else if (letter.type === "wrong") {
            ++wrongCount;
        }
    });
    let accuracy = rightCount / (rightCount + wrongCount) * 100;
    if (wrongCount === 0) {
        accuracy = 100;
    }
    return accuracy;
}


/**
 * Checks if the displayed user is the current user
 * @param {Object} user 
 * @param {Object} currentUser 
 * @returns {Boolean}
 */
export function checkUser(user, currentUser) {
    return user.id === currentUser.id;
}