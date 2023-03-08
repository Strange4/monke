import './Styles/PlayerItem.css';

/**
 * Displays a single user's name and image in lobby
 * @param {*} props 
 * @returns {ReactElement}
 */
function PlayerItem(props) {
    return (
        <div className="player-info">
            <img className="player-image" src={`${props.picture}`} />
            <p className='player-name'>{props.name}</p>
        </div>
    );
}

export default PlayerItem;