import './Styles/Leaderboard.css';
import './Styles/Popup.css'
import RankListItem from './RankListItem';
import { useFetch } from '../Controller/FetchModule';

/**
 * Displays the users along with their stats to the leaderboard
 * @returns {ReactElement}
 */
function Leaderboard() {
    const [loadingIndicator, leaderboard] = useFetch("leaderboard", "/api/leaderboard")
    return (
        <div id="leaderboard" className='popup'>
            <h1>Leaderboard</h1>
            <div id="rankings">
                <div id="leaderboard-header">
                    <p>Rank</p>
                    <p>User</p>
                    <p>WPM</p>
                    <p>Accuracy</p>
                    <p>Date</p>
                </div>
                {
                    loadingIndicator || leaderboard.map((user, i) => <RankListItem
                        user={user.username}
                        picture={user.picture_url}
                        rank={i + 1}
                        wpm={Math.round(user.user_stats.max_wpm * 100) / 100}
                        accuracy={Math.round(user.user_stats.max_accuracy * 100) / 100}
                        date={`${user.user_stats.date.split("T")[0]}`}
                        key={i} />)
                }
            </div>
        </div>
    );
}

export default Leaderboard;