import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import useGameText from '../GameText';
import Chronometer from './Chronometer';
import Timer from "timer-machine";
import SoloGameResult from './SoloGameResult';

/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 * @author Rim Dallali
 */
function TypingScreen() {
    const textToDisplay = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;
    const [keyboard, setKeyboard] = useState(allRegKeys);
    const [gameState, setGameState] = useState("reset");
    const [timer, setTimer] = useState(new Timer());
    const [displayTime, setDisplayTime] = useState({ "seconds": 0 });
    const [userDisplay, setUserDisplayText] = useState(getDefaultUserDisplay());
    const [GameText, updateGameText] = useGameText(userDisplay, setUserDisplayText);
    let textContainerRef = useRef();
    const keyRefs = useRef(new Map());

    function mapKeys(letter, virtualKey) {
        keyRefs.current.set(letter, virtualKey);
    }

    function onChangeText(currentText) {
        if (currentText.length === 1 && !timer.isStarted()) {
            setGameState("started");
        } else if (textToDisplay.length === currentText.length && timer.isStarted()) {
            setGameState("stopped");
            cleanVirtualKeyboard();
        }
        updateGameText(currentText);
    }

    function getDefaultUserDisplay() {
        return Array.from(textToDisplay).map((letter) => {
            // the type of a displayed letter can only be right | wrong | none
            return {
                letter,
                type: "none"
            }
        });
    }

    function cleanVirtualKeyboard() {
        keyRefs.current.forEach(key => {
            key.current.classList.remove("pressed");
        });
    }

    return (
        <div className='vertical-center'>
            <Chronometer seconds={displayTime.seconds} state={displayTime.state} />
            {GameText}
            <TextContainer
                textRef={textContainerRef}
                keyRefs={keyRefs}
                currentKeys={keyboard}
                allRegKeys={allRegKeys}
                allShiftKeys={allShiftKeys}
                setKeyboard={setKeyboard}
                onChangeText={onChangeText}
            />
            <VirtualKeyboard currentKeys={keyboard} mapKeys={mapKeys} />
            <SoloGameResult
                setGameState={setGameState}
                gameState={gameState}
                userDisplay={userDisplay}
                timer={timer}
                setTimer={setTimer}
                setDisplayTime={setDisplayTime}
                textRef={textContainerRef}
                textDisplay={textToDisplay}
            />
        </div>
    );
}

export default TypingScreen;
