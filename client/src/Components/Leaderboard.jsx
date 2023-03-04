import './Styles/Leaderboard.css';
import './Styles/Popup.css'
import RankListItem from './RankListItem';
import { useFetch } from '../Controller/FetchModule';

/**
 * Displays the users along with their stats to the leaderboard
 * @returns {ReactElement}
 */
function Leaderboard() {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
    const [loadingIndicator, leaderboard] = useFetch("leaderboard", "/api/leaderboard")
    return (
        <div id="leaderboard">
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
                        wpm={user.user_stats.wpm}
                        accuracy={user.user_stats.accuracy}
                        date={`${date}`}
                        key={i} />)
                }
            </div>
        </div>
    );
}

export default Leaderboard;