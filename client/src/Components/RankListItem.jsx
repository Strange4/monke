import './Styles/RankListItem.css';

const RankListItem = (props) => {
    return (
        <div className="rank-list-item">
            <p>{props.rank}</p>
            <p><img src={`${props.user_image}`}></img>{props.username}</p>
            <p>{props.wpm}</p>
            <p>{props.date}</p>
        </div>
    );
};

export default RankListItem;