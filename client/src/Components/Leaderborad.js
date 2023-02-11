import './Styles/Leaderboard.css';
import RankListItem from './RankListItem';

const Leaderboard = () => {
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`
    return (
        <div id="leaderboard">
            <h1>Leaderboard</h1>
            <div id="rankings">
                <RankListItem
                    rank="1"
                    username="Name"
                    wpm="200"
                    date={`${date}`}>

                </RankListItem>
            </div>
        </div>
    );
};

export default Leaderboard;