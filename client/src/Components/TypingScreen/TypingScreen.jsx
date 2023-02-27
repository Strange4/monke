import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import VirtualKeyboard from './VirtualKeyboard';
import TextContainer from './TextContainer';
import keyboardKeys from "../../Data/keyboard_keys.json";
import useGameText from '../GameText';
import Chronometer from './Chronometer';
import Timer from "timer-machine";
import SoloGameResult from './SoloGameResult';
import { useFetch } from '../../Controller/FetchModule';

/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 */
function TypingScreen() {
    // const textToDisplay = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    const [loadingSpinner, textToDisplay] = useFetch("gameQuote", "/api/quote");
    // const textToDisplay = undefined;
    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;
    const [keyboard, setKeyboard] = useState(allRegKeys);
    const [gameState, setGameState] = useState("reset");
    const [timer, setTimer] = useState(new Timer());
    const [displayTime, setDisplayTime] = useState({ "seconds": 0 });
    const [userDisplay, setUserDisplayText] = useState(
        getDefaultUserDisplay(textToDisplay ? textToDisplay.body : undefined));
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
     * @param {InputEvent} e 
     */
    function onChangeText(e) {
        const currentText = e.target.value;
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
     * @returns {Object[]}
     */
    function getDefaultUserDisplay(stringToDisplay) {
        if(!stringToDisplay){
            return [];
        }
        console.log(stringToDisplay)
        const display = Array.from(stringToDisplay).map((letter) => {
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

    // function handleKeyUp(e){

    // }

    // function handleKeyDown(e){
        
    // }

    

    return (
        
        <div className='vertical-center'>
            {
                loadingSpinner || 
                <>
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
                </>
            }
            {/* <input type="text" 
                className="text-container"
                onPaste={preventDefaultBehavior}
                onDrag={preventDefaultBehavior}
                onDrop={preventDefaultBehavior}
                onCopy={preventDefaultBehavior}
                onChange={onChangeText}
            /> */}
        </div>
    );
}

/**
 * prevents the deafult behavior from an event
 * @param {Event} e the event to prevent
 */
// function preventDefaultBehavior(e){
//     e.preventDefault();
// }

export default TypingScreen;
