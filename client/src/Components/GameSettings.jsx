import './Styles/Settings.css';
import LengthSettings from './LengthSettings';
import { FaAt } from 'react-icons/fa';
import { setCookie } from '../Controller/CookieHelper';
import { HiCog } from "react-icons/hi"
import Preferences from './Preferences/Preferences';
import { useState } from 'react';

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

    const [showPref, setShowPref] = useState(false);

    function toggleShowPref() {
        setShowPref(!showPref);
    }

    return (
        <div id="settings">
            <li id='prefs'>
                <HiCog onClick={toggleShowPref} id="pref-icon" />
                {showPref ?
                    <Preferences open={showPref} toggleShow={toggleShowPref} /> : null}
            </li>
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