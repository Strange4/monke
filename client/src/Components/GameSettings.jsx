import './Styles/Settings.css';
import TimeSettings from './TimeSettings';
import LengthSettings from './LengthSettings';
import { useState } from 'react';
import { CiTimer } from 'react-icons/ci'
import { FaAt } from 'react-icons/fa'
import { CgPassword } from 'react-icons/cg'
/**
 * Displays game settings
 * @returns {ReactElement}
 */
function GameSettings() {

    const [mode, setMode] = useState(true)

    /**
     * Display correct mode settings according to button pressed
     * @param {*} e 
     */
    const handleClick = e => {
        if(e.target.id === "time-btn") {
            setMode(true)
        } else if(e.target.id === "length-btn") {
            setMode(false)
        }
    }

    return (
        <div id="settings">

            <div id="global-settings">
                <button>
                    <FaAt className="game-setting-icon"/>
                    Punctuation
                </button>
            </div>
            <div id="game-mode">
                <button id="time-btn" onClick={handleClick}>
                    <CiTimer className="game-setting-icon"/>
                    Time
                </button>
                <button id="length-btn" onClick={handleClick}>
                    <CgPassword className="game-setting-icon"/>
                    Length
                </button>
            </div>
            
            {mode && <TimeSettings/>}
            {!mode && <LengthSettings/>}

        </div>
    );
}

export default GameSettings;