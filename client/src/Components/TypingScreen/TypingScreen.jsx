import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import { useState, useRef } from "react";

/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 * @author Rim Dallali
 */
function TypingScreen() {

    const keyRefs = useRef(new Map());

    function mapKeys(letter, virtualKey) {
        keyRefs.current.set(letter, virtualKey);
    }

    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;

    const [keyboard, setKeyboard] = useState(allRegKeys);

    return (
        <>
            <TextContainer
                keyRefs={keyRefs}
                currentKeys={keyboard}
                allRegKeys={allRegKeys}
                allShiftKeys={allShiftKeys}
                setKeyboard={setKeyboard}
            />
            <VirtualKeyboard currentKeys={keyboard} mapKeys={mapKeys} />
        </>
    );
}

export default TypingScreen;
