import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import useGameText from '../GameText';


/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 * @author Rim Dallali
 */
function TypingScreen() {
    const textToDisplay = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab pariatur laboriosam nobis, excepturi eaque adipisci amet placeat similique modi sunt suscipit. Aspernatur nam eum nesciunt excepturi maiores repellendus tenetur distinctio!";
    const [GameText, updateGameText] = useGameText(textToDisplay);
    const keyRefs = useRef(new Map());

    function mapKeys(letter, virtualKey) {
        keyRefs.current.set(letter, virtualKey);
    }

    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;

    const [keyboard, setKeyboard] = useState(allRegKeys);
    function onChangeText(currentText) {
        updateGameText(currentText);
    }

    return (
        <div className='vertical-center'>
            {GameText}
            <TextContainer
                keyRefs={keyRefs}
                currentKeys={keyboard}
                allRegKeys={allRegKeys}
                allShiftKeys={allShiftKeys}
                setKeyboard={setKeyboard}
                onChangeText={onChangeText}
            />
            <VirtualKeyboard currentKeys={keyboard} mapKeys={mapKeys} />
        </div>
    );
}

export default TypingScreen;