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

    function handleOnChange(e) {
        let letter = e.nativeEvent.key;

        if (letter === "Shift") {
            props.setKeyboard(props.allShiftKeys);
        }
        if (props.currentKeys.some(row => row.includes(letter))) {
            letter = cleanUpLetter(letter);

            let currentKey = props.keyRefs.current.get(letter).current;

            currentKey.classList.add("pressed");
            setTimeout(() => {
                currentKey.classList.remove("pressed");
            }, 150);
        }
    }

    function handleShiftRelease(e) {
        if (e.nativeEvent.key === "Shift") {
            props.setKeyboard(props.allRegKeys);
        }
    }

    return (
        <textarea
            className="text-container"
            onKeyUp={e => handleShiftRelease(e)}
            onKeyDown={e => handleOnChange(e)}>
        </textarea>
    )
}

export default TextContainer;