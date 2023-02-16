import "./Layout/TextContainer.css";
import { cleanUpLetter } from "../../Controller/ConversionHelper";
import { useState } from "react";

/**
 * Temporary text container to heberge user typed 
 * text to reflect on the virtual keyboard
 * @param {*} props 
 * @returns {ReactElement}
 * @author Rim Dallali
 */
function TextContainer(props) {
    function handleKeyDown(e) {
        let letter = e.nativeEvent.key;

        if (letter === "Shift" && e.getModifierState('CapsLock') === false) {
            props.setKeyboard(props.allShiftKeys);
        } else if (letter === "Shift" && e.getModifierState('CapsLock') === true) {
            props.setKeyboard(props.allRegKeys);
        } else if (letter === "CapsLock") {
            props.setKeyboard(
                props.currentKeys === props.allRegKeys ? props.allShiftKeys : props.allRegKeys
            );
        }
        if (props.currentKeys.some(row => row.includes(letter))) {
            letter = cleanUpLetter(letter);

            let currentKey = props.keyRefs.current.get(letter).current;
            currentKey.classList.add("pressed");
            currentKey.classList.remove("unpressed");
        }
    }

    function handlekeyUp(e) {
        console.log(e.getModifierState('CapsLock'))
        const key = e.nativeEvent.key;
        console.log(key)
        if (key === "Shift" && e.getModifierState('CapsLock') === false) {
            props.setKeyboard(props.allRegKeys);
        } else if (key === "Shift" && e.getModifierState('CapsLock') === true) {
            props.setKeyboard(props.allShiftKeys);
        }
        if (props.currentKeys.some(row => row.includes(key))) {
            const letter = cleanUpLetter(key);
            const currentKey = props.keyRefs.current.get(letter).current;
            currentKey.classList.remove("pressed");
            currentKey.classList.add("unpressed");
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
    };

    return (
        <input
            type="text"
            onPaste={handleChange}
            onDrag={handleChange}
            onDrop={handleChange}
            onCopy={handleChange}
            ref={props.textRef}
            className="text-container"
            onKeyUp={e => handlekeyUp(e)}
            onKeyDown={e => handleKeyDown(e)}
            onChange={(e) => props.onChangeText(e.target.value)}>
        </input >
    )
}

export default TextContainer;