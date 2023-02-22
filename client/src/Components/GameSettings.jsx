import './Styles/GameSettings.css';
import TimeSettings from './TimeSettings';
import LengthSettings from './LengthSettings';
import { useState } from 'react';

/**
 * Displays a loading spinner
 * @returns {ReactElement}
 */
function GameSettings() {

    const [time, setTimeMode] = useState(true)
    const [length, setLengthMode] = useState(false)

    const handleClick = e => {
        if(e.target.id === "time-btn") {
            setTimeMode(true)
            setLengthMode(false)
        } else if(e.target.id === "length-btn") {
            setLengthMode(true)
            setTimeMode(false)
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

            {/* will add mode specific options here */}
            
            {time && <TimeSettings/>}
            
            {length && <LengthSettings/>}

        </div>
    );
}

export default GameSettings;