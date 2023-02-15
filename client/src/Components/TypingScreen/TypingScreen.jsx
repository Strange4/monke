import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import useGameText from '../GameText';
import Chronometer from './Chronometer';
import Timer from "timer-machine";
import Popup from "reactjs-popup";
import SoloGameResult from './SoloGameResult';


/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 * @author Rim Dallali
 */
function TypingScreen() {
    // const textToDisplay = "Lorem ipsum"
    const textToDisplay = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab pariatur laboriosam nobis, excepturi eaque adipisci amet placeat similique modi sunt suscipit. Aspernatur nam eum nesciunt excepturi maiores repellendus tenetur distinctio!";
    const [timer, setTimer] = useState(new Timer());
    const [displayTime, setDisplayTime] = useState({ "seconds": 0})
    const [popup, setPopup] = useState(false);
    const [results, setResults] = useState({"time": 0, "wpm": 0})
    const [GameText, updateGameText] = useGameText(textToDisplay, timer, setTimer, setDisplayTime, displayTime, setPopup, setResults);
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
            <Chronometer seconds={displayTime.seconds} state={displayTime.state} />
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
            <Popup open={popup} position="center" modal>
                <SoloGameResult time={results.time} wpm={results.wpm}/>
            </Popup>
        </div>
    );
}

export default TypingScreen;
