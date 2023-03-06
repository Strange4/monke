/**
 * Return the average of a stat
 * @param {Number} stat, the previous average of the stat.
 * @param {Number} newStat, the new stat obtain after a game has been complete. 
 * @param {Number} games, the total number of games.
 * @returns Average of the stat
 */
export function getAverage(stat, newStat, games) {
    if (games === 0) {
        return newStat;
    }
    const unAverage = stat * games;
    const newTotal = unAverage + newStat;
    return newTotal / games;
    
}