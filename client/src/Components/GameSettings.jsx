import './Styles/Settings.css';
import LengthSettings from './LengthSettings';
import { FaAt } from 'react-icons/fa'
/**
 * Displays game settings
 * @returns {ReactElement}
 */
function GameSettings() {

    return (
        <div id="settings">

            <div id="global-settings">
                <button>
                    <FaAt className="game-setting-icon"/>
                    Punctuation
                </button>
            </div>
            
            <LengthSettings/>

        </div>
    );
}

export default GameSettings;