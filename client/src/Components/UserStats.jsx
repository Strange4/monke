/**
 * Displays a single user's stats
 * @param {*} props 
 * @returns {ReactElement}
 */
function UserStats(profileData) {

    return (
        <div id="user-stats">
            <p><span className="label">Avg. WPM: </span>
                {Math.round(profileData.userData.user_stats.wpm * 100) / 100}
            </p>
            <p><span className="label">Avg. ACC: </span>
                {Math.round(profileData.userData.user_stats.accuracy * 100) / 100}
            </p>
            <p><span className="label">Max WPM: </span>
                {Math.round(profileData.userData.user_stats.max_wpm * 100) / 100}
            </p>
            <p><span className="label">Max ACC: </span>
                {Math.round(profileData.userData.user_stats.max_accuracy * 100) / 100}
            </p>
            <p><span className="label">Games: </span>
                {profileData.userData.user_stats.games_count}
            </p>
            <p><span className="label">Wins: </span>
                {profileData.userData.user_stats.win}
            </p>
            <p><span className="label">Loses: </span>
                {profileData.userData.user_stats.lose}
            </p>
            <p><span className="label">Draws: </span>
                {profileData.userData.user_stats.draw}
            </p>
        </div>
    );
}

export default UserStats;
