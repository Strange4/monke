import './Styles/GameSettings.css';

/**
 * Displays a loading spinner
 * @returns {ReactElement}
 */
function LengthSettings() {
    return (
        <div id="game-settings">
            <button>10</button>
            <button>25</button>
            <button>50</button>
            <button>100</button>
        </div>
    );
}

export default LengthSettings;