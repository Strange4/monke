import './Styles/RankListItem.css';

/**
 * Displays a single user's stats to the leaderboard component
 * @param {*} props 
 * @returns {ReactElement}
 */
function RankListItem(props) {
    return (
        <div className="rank-list-item">
            <p id="user-rank">{props.rank}</p>
            <div id='rank-user'>
                <img className="leaderboard-user-icon" src={`${props.picture}`} />
                <p className='username'>{props.user}</p>
            </div>
            <p>{props.wpm}</p>
            <p className='user-acc'>{props.accuracy}</p>
            <p id='rank-date'>{props.date}</p>
        </div>
    );
}

export default RankListItem;