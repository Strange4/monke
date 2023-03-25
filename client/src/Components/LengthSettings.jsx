import './Styles/Settings.css';

/**
 * Displays time specific settings
 * @returns {ReactElement}
 */
function LengthSettings() {
    return (
        <div id="length-settings">
            <button>short</button>
            <button>medium</button>
            <button>long</button>
        </div>
    );
}

export default LengthSettings;