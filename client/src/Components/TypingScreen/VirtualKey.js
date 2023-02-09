import "./Layout/VirtualKey.css";

/**
 * Displays a single virtual key with its value
 * @param {*} props 
 * @returns HTMLElement
 * @author Rim Dallali
 */
function VirtualKey(props) {
    return (
        <div
            className={`keyboard-key ${props.classValue}`}
            id={props.keyCode}> {props.keyValue}
        </div>
    );
}

export default VirtualKey;
