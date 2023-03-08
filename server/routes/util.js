/**
 * Return the average of a stat
 * @param {Number} stat, the previous average of the stat.
 * @param {Number} newStat, the new stat obtain after a game has been complete. 
 * @param {Number} games, the total number of games BEFORE this new stat
 * @returns Average of the stat
 */
export function getAverage(stat, newStat, games) {
    if (games === 0) {
        return newStat;
    }
    const unAverage = stat * games;
    const newTotal = unAverage + newStat;
    return newTotal / (games + 1);
}

/**
 * gets a random integer between two numbers
 * @param {number} min inclusive
 * @param {number} max inclusive
 */
export function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}