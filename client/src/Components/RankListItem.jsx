import './Styles/RankListItem.css';

const RankListItem = (props) => {
    return (
        <div className="rank-list-item">
            <p>{props.rank}</p>
            <img className="leaderboard_user_icon" src={`${props.picture}`}/><p>{props.user}</p>
            <p>{props.wpm}</p>
            <p>{props.date}</p>
        </div>
    );
};

export default RankListItem;