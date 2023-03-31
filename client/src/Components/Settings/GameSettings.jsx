import '../Styles/Settings.css';
import LengthSettings from './LengthSettings';
import { FaAt } from 'react-icons/fa';
import { setCookie } from '../../Controller/CookieHelper';

/**
 * Displays game settings
 * @returns {ReactElement}
 */
function GameSettings(props) {

    /**
     * Set the punctuation for the game and also adds a cookie with that value.
     */
    function setPunctuation(){
        if (props.punctuation){
            setCookie("punctuation", false);
            props.setPunctuation(false);
        } else {
            setCookie("punctuation", true);
            props.setPunctuation(true);
        }
    }

    return (
        <div id="settings">
            <div id="global-settings">
                <button className={props.punctuation ? "highlightSetting" : ""} 
                    onClick={setPunctuation}>
                    <FaAt className={props.punctuation 
                        ? "highlightSetting game-setting-icon" : "game-setting-icon"}/>
                    Punctuation
                </button>
            </div>
            <LengthSettings quoteLength={props.quoteLength} setLength={props.setLength}/>
        </div>
    );
}

export default GameSettings;