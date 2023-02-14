import './Styles/Leaderboard.css';
import RankListItem from './RankListItem';
import { useEffect, useState } from 'react';
import * as FetchModule from "../Controller/FetchModule"

const Leaderboard = () => {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`

    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        (async function loadLeaderboardData() {
            let leaderboardData = await FetchModule.fetchData("/api/leaderboard")
            setLeaderboard(leaderboardData)
        })();
    }, [])

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
                    leaderboard.map((user, i) => <RankListItem 
                        user={user.username}
                        picture={user.profilePicture} 
                        rank={user.rank} 
                        wpm={user.wpm}
                        accuracy={user.accuracy}
                        date={`${date}`}
                        key={i}/> )
                }
            </div>
        </div>
    );
};

export default Leaderboard;