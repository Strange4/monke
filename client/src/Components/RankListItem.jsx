import './Styles/RankListItem.css';

/**
 * Displays a single user's stats to the leaderboard component
 * @param {*} props 
 * @returns {ReactElement}
 */
function RankListItem(props) {
    return (
        <div className="rank-list-item">
            <p>{props.rank}</p>
            <img className="leaderboard_user_icon" src={`${props.picture}`} /><p>{props.user}</p>
            <p>{props.wpm}</p>
            <p>{props.accuracy}</p>
            <p>{props.date}</p>
        </div>
    );
}

export default RankListItem;