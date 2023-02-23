import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import useGameText from '../GameText';
import Chronometer from './Chronometer';
import Timer from "timer-machine";
import SoloGameResult from './SoloGameResult';

/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
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

    /**
     * maps each letter code to its virtual key on the keyboard
     * @param {*} letter 
     * @param {*} virtualKey 
     */
    function mapKeys(letter, virtualKey) {
        keyRefs.current.set(letter, virtualKey);
    }

    /**
     * Changes the game state according to the current text progress.
     * @param {String} currentText 
     */
    function onChangeText(currentText) {
        if (currentText.length === 1 && !timer.isStarted()) {
            setGameState("started");
        } else if (textToDisplay.length === currentText.length && timer.isStarted()) {
            setGameState("stopped");
            cleanVirtualKeyboard();
        }
        updateGameText(currentText);
    }

    /**
     * Get's the default user display filler with letter object with type none.
     * @returns {Object}
     */
    function getDefaultUserDisplay() {
        const display = Array.from(textToDisplay).map((letter) => {
            // the type of a displayed letter can only be right | wrong | none
            return {
                letter,
                type: "none",
                current: false
            }
        });

        display[0].current = true;

        return display;
    }

    /**
     * Cleans the state of the virtual keyboard and marks each key as unpressed.
     */
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
