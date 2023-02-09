import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import { useState } from "react";

/**
 * Container for the Textarea and the virtual keyboard
 * @returns HTMLElement
 * @author Rim Dallali
 */
function TypingScreen() {
    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;

    const [keyboard, setKeyboard] = useState(allRegKeys);
    const [pressedKey, setPressedKey] = useState("");

    return (
        <div className="App">
            <TextContainer
                currentKeys={keyboard}
                allRegKeys={allRegKeys}
                allShiftKeys={allShiftKeys}
                setKeyboard={setKeyboard}
                setPressedKey={setPressedKey} />
            <VirtualKeyboard currentKeys={keyboard} pressedKey={pressedKey} />
        </div>
    );
}

export default TypingScreen;
