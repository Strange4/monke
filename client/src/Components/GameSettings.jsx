import './Styles/Settings.css';
import LengthSettings from './LengthSettings';
import { FaAt } from 'react-icons/fa';
/**
 * Displays game settings
 * @returns {ReactElement}
 */
function GameSettings(props) {

    return (
        <div id="settings">
            <div id="global-settings">
                <button>
                    <FaAt className="game-setting-icon"/>
                    Punctuation
                </button>
            </div>
            <LengthSettings setLength={props.setLength}/>
        </div>
    );
}

export default GameSettings;