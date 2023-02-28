import "./Layout/VirtualKey.css";

/**
 * Displays a single virtual key with its value
 * @param {{letter: string; isPressed: boolean; }} props 
 * @returns {ReactElement}
 */
function VirtualKey({keyValue, classValue, isPressed}) {

    return (
        <div
            className={`keyboard-key ${classValue} ${isPressed ? "pressed" : undefined}`}>
            {keyValue}
        </div>
    );
}

export default VirtualKey;
