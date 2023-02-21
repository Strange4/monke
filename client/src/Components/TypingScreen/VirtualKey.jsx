import "./Layout/VirtualKey.css";
import { useRef, useEffect } from "react";

/**
 * Displays a single virtual key with its value
 * @param {*} props 
 * @returns {ReactElement}
 */
function VirtualKey(props) {

    const keyRef = useRef();

    useEffect(() => {
        props.mapKeys(props.keyCode, keyRef);
    }, [props.keyCode]);

    return (
        <div
            ref={keyRef}
            className={`keyboard-key ${props.classValue}`}
            id={props.keyCode}> {props.keyValue}
        </div>
    );
}

export default VirtualKey;
