import './Styles/Leaderboard.css';
import RankListItem from './RankListItem';

const Leaderboard = () => {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`
    return (
        <div id="leaderboard">
            <h1>Leaderboard</h1>
            <div id="rankings">
                <div id="leaderboard-header">
                    <p>Rank</p>
                    <p>User</p>
                    <p>WPM</p>
                    <p>Date</p>
                </div>
                <RankListItem
                    rank="1"
                    username="Name1"
                    wpm="200"
                    date={`${date}`}>

                </RankListItem>
                <RankListItem
                    rank="2"
                    username="Name2"
                    wpm="192"
                    date={`${date}`}>

                </RankListItem>
                <RankListItem
                    rank="3"
                    username="Name3"
                    wpm="185"
                    date={`${date}`}>

                </RankListItem>
            </div>
        </div>
    );
};

export default Leaderboard;