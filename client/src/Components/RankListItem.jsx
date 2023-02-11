import './Styles/RankListItem.css';

const RankListItem = (props) => {
    return (
        <div id="rank-list-item">
            <p>{props.rank}</p>
            <img src={`${props.user_image}`}></img>
            <p>{props.username}</p>
            <p>{props.wpm}</p>
            <p>{props.date}</p>
        </div>
    );
};

export default RankListItem;