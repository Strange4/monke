import './Styles/GameSettings.css';
import TimeSettings from './TimeSettings';
import LengthSettings from './LengthSettings';
import { useState } from 'react';

/**
 * Displays a loading spinner
 * @returns {ReactElement}
 */
function GameSettings() {

    return (
        <div id="game-settings">
            <div id="global-settings">
                <button>punctuation</button>
            </div>
            <div id="game-mode">
                <button>Time Based</button>
                <button>Length Based</button>
            </div>
            {/* will add mode specific options here */}
        </div>
    );
}

export default GameSettings;