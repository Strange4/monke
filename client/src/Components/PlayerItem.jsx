import './Styles/PlayerItem.css';
import { RiVipCrownLine } from 'react-icons/ri';

/**
 * Displays a single user's name and image in lobby
 * @param {*} props 
 * @returns {ReactElement}
 */
function PlayerItem(props) {
    return (
        <div className="player-info">
            <img className="player-image" src={`${props.avatar}`} />
            <p className='player-name'>
                {props.name}
                {
                    props.leader ?
                        <RiVipCrownLine />
                        :
                        null
                }
            </p>
        </div>
    );
}

export default PlayerItem;