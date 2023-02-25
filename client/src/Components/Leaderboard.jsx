import './Styles/Leaderboard.css';
import { useEffect, useState } from 'react';
import RankListItem from './RankListItem';
import * as FetchModule from "../Controller/FetchModule";

/**
 * Displays the users along with their stats to the leaderboard
 * @returns {ReactElement}
 */
function Leaderboard() {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    const [leaderboard, setLeaderboard] = useState([]);
    const { loadingPlaceHolder, sendRequest } = FetchModule.useFetch("/api/leaderboard");

    useEffect(() => {
        sendRequest((data) => {
            setLeaderboard(data);
        });
    }, []);

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
                    loadingPlaceHolder ||
                    leaderboard.map((user, i) => <RankListItem
                        user={user.username}
                        picture={user.profilePicture}
                        rank={user.rank}
                        wpm={user.wpm}
                        accuracy={user.accuracy}
                        date={`${date}`}
                        key={i} />)
                }
            </div>
        </div>
    );
}

export default Leaderboard;