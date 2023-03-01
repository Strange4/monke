import './Styles/GameSettings.css';
import TimeSettings from './TimeSettings';
import LengthSettings from './LengthSettings';
import { useState } from 'react';

/**
 * Displays game settings
 * @returns {ReactElement}
 */
function GameSettings() {

    const [mode, setMode] = useState(true)

    const handleClick = e => {
        if(e.target.id === "time-btn") {
            setMode(true)
        } else if(e.target.id === "length-btn") {
            setMode(false)
        }
    }

    return (
        <div id="game-settings">

            <div id="global-settings">
                <button>Punctuation</button>
            </div>
            <div id="game-mode">
                <button id="time-btn" onClick={handleClick}>Time Based</button>
                <button id="length-btn" onClick={handleClick}>Length Based</button>
            </div>
            
            {mode && <TimeSettings/>}
            {!mode && <LengthSettings/>}

        </div>
    );
}

export default GameSettings;