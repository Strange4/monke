import "./Layout/TextContainer.css";
import { cleanUpLetter } from "../../Controller/ConversionHelper";

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

        if (letter === "Shift") {
            props.setKeyboard(props.allShiftKeys);
        }
        if (props.currentKeys.some(row => row.includes(letter))) {
            letter = cleanUpLetter(letter);

            let currentKey = props.keyRefs.current.get(letter).current;
            currentKey.classList.add("pressed");
            currentKey.classList.remove("unpressed");
        }
    }

    function handlekeyUp(e) {
        const key = e.nativeEvent.key;
        if (key === "Shift") {
            props.setKeyboard(props.allRegKeys);
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