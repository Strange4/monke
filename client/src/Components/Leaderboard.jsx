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
    const sortLeaderboard = (p1, p2) => (p1 < p2) - (p1 > p2)

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
                    loadingIndicator || leaderboard.sort(function (p1, p2) {
                        return sortLeaderboard(
                            p1.user_stats.max_wpm, p2.user_stats.max_wpm) ||
                            sortLeaderboard(p1.user_stats.max_accuracy, p2.user_stats.max_accuracy
                            )
                    }).map((user, i) => <RankListItem
                        user={user.username}
                        picture={user.picture_url}
                        rank={i + 1}
                        wpm={Math.round(user.user_stats.max_wpm * 100) / 100}
                        accuracy={Math.round(user.user_stats.max_accuracy * 100) / 100}
                        date={`${date}`}
                        key={i} />)
                }
            </div>
        </div>
    );
}

export default Leaderboard;