import "./Layout/Chronometer.css";

/**
 * Renders a timer displaying the number of seconds
 * that went by since the timer's first start.
 * @param {*} props 
 * @returns {ReactElement}
 */
function Chronometer(props) {
    return (
        <div id="chronometer">
            <p><span id="seconds">{props.seconds}</span></p>
        </div>
    );
}

export default Chronometer;