import './Styles/GameSettings.css';

/**
 * Displays a loading spinner
 * @returns {ReactElement}
 */
function TimeSettings() {
    return (
        <div id="time-settings">
            <button>15</button>
            <button>30</button>
            <button>60</button>
        </div>
    );
}

export default TimeSettings;