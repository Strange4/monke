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
        setTimeMode(current => !current)
        setLengthMode(current => !current)
    }

    return (
        <div id="game-settings">

            <div id="global-settings">
                <button>Punctuation</button>
            </div>
            <div id="game-mode">
                <button onClick={handleClick}>Time Based</button>
                <button onClick={handleClick}>Length Based</button>
            </div>

            {/* will add mode specific options here */}
            
            {time && <TimeSettings/>}
            {length && <LengthSettings/>}

        </div>
    );
}

export default GameSettings;