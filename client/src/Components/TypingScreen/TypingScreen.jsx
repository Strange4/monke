import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import VirtualKeyboard from './VirtualKeyboard';
import keyboardKeys from "../../Data/keyboard_keys.json";
import GameText from '../GameText';
import Chronometer from './Chronometer';
import { useChronometer } from './Chronometer';
import SoloGameResult from './SoloGameResult';
import { useQuery } from 'react-query';
import Spinner from '../Spinner';

const allShiftKeys = keyboardKeys.english.upper;
const allRegKeys = keyboardKeys.english.lower;
/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 */
function TypingScreen() {
    
    const {
        isLoading, error, data: textToDisplay, refetch 
    } = useQuery("textToDisplay", async () => {
        return (await (await fetch("/api/quote")).json()).body;
    }, {onSuccess: (quote) => {
        setUserDisplay(getDefaultUserDisplay(quote))
    }, refetchOnWindowFocus: false});
    const [keyboard, setKeyboard] = useState(mapKeyToKeyboard(allRegKeys));
    const [displayTime, setDisplayTime] = useState(0);
    const [displayResults, setDisplayResults] = useState(false);
    const { startTimer, stopTimer, resetTimer, timer } = useChronometer(setDisplayTime);
    const [userDisplay, setUserDisplay] = useState(getDefaultUserDisplay(textToDisplay));
    const textContainerRef = useRef();

    function handleGameEnd(){
        stopTimer();
        setDisplayResults(true);
    }
    
    function resetGame(){
        setDisplayResults(false);
        resetTimer();
        textContainerRef.current.value = "";
        setUserDisplay([]);
        refetch();
    }

    /**
     * Changes the game state according to the current text progress.
     * @param {InputEvent} e 
     */
    function onChangeText(e) {
        const currentText = e.target.value;
        if (currentText.length === 1) {
            startTimer();
        } else if (textToDisplay.length === currentText.length) {
            handleGameEnd();
        }
        renderLetters(currentText, userDisplay);
    }

    /**
     * handles the key up event and sets keyboard
     * according to shift and caps states.
     * @param {Event} e 
     */
    function handlekeyUp(e) {
        const keyValue = e.nativeEvent.key;
        let newKeyboard = keyboard.slice();
        if (keyValue === "Shift") {
            newKeyboard = mapKeyToKeyboard(allRegKeys, newKeyboard);
        }
        newKeyboard.forEach(row => {
            row.forEach(key => {
                if(key.keyValue === keyValue){
                    key.isPressed = false;
                }
            });
        });
        setKeyboard(newKeyboard);
    }

    /**
     * handles the key down event and sets keyboard
     * according to shift and caps states.
     * @param {Event} e 
     */
    function handleKeyDown(e) {
        const keyValue = e.nativeEvent.key;
        let newKeyboard = keyboard.slice();
        if (keyValue === "Shift") {
            newKeyboard = mapKeyToKeyboard(allShiftKeys, newKeyboard);
        }
        newKeyboard.forEach(row => {
            row.forEach(key => {
                if(key.keyValue === keyValue){
                    key.isPressed = true;
                }
            });
        });
        setKeyboard(newKeyboard);
    }

    

    return (
        <div className='center'>
            {isLoading || error ?
                <Spinner/>
                :
                <>
                    <Chronometer seconds={displayTime}/>
                    <GameText display={userDisplay} />
                    <VirtualKeyboard currentKeys={keyboard} />
                    <SoloGameResult
                        isOpen={displayResults}
                        displayText={userDisplay}
                        timer={timer.current}
                        originalText={textToDisplay}
                        closeWindow={resetGame}
                    />
                    <input type="text" 
                        className="text-container"
                        ref={textContainerRef}
                        onChange={onChangeText}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handlekeyUp}
                        onPaste={preventDefaultBehavior}
                        onDrag={preventDefaultBehavior}
                        onDrop={preventDefaultBehavior}
                        onCopy={preventDefaultBehavior}
                    />
                </>}
        </div>
    );
}

/**
 * prevents the deafult behavior from an event
 * @param {Event} e the event to prevent
 */
function preventDefaultBehavior(e){
    e.preventDefault();
}


/**
 * changes the type (right | wrong | none) of the display of letters based on the user input
 * @param {string} newInput the new input that has been changed by the user
 * @param {{ letter: string; type: string; current: boolean; }[]} display the current display state
 */
function renderLetters(newInput, display) {
    const newLetterIndex = newInput.length - 1;
    const newDisplay = display;

    // are are setting all the next letters that could posibly be deleted to none.
    for (let i = newLetterIndex + 1; i < newDisplay.length; i++) {
        newDisplay[i].type = "none";
        newDisplay[i].current = false;
    }
    
    const inputIsEmpty = newInput.length === 0;
    const inputIsDone = newInput.length > newDisplay.length;
    // if the input is done don't do anything
    if(inputIsDone){
        return display;
    }
    const nextLetter = newDisplay[newLetterIndex + 1];
    if(nextLetter){
        nextLetter.current = true;
    }

    if(!inputIsEmpty){
        const newLetter = newDisplay[newLetterIndex];
        newLetter.current = false;
        if(newLetter.letter === newInput[newLetterIndex]){
            newLetter.type = "right";
        } else {
            newLetter.type = "wrong";
        }
    }
    return newDisplay;
}

/**
 * Get's the default user display filler with letter object with type none.
 * @param {string} stringToDisplay the original string that needs to be transformed
 */
function getDefaultUserDisplay(stringToDisplay) {
    if(!stringToDisplay){
        return [];
    }
    const display = Array.from(stringToDisplay).map((letter) => {
        // the type of a displayed letter can only be right | wrong | none
        return {
            letter,
            type: "none",
            current: false
        }
    });
    if(display[0]){
        display[0].current = true;
    }
    return display;
}

/**
 * maps keyboard keys to an array of pressed and unpressed keys
 * if a prevous state if defined, maps the new keys to the previous state (pressed or unpressed)
 * @param {string[][]} keys the keys that need to me mapped
 * @param {{ keyValue: string; isPressed: boolean; }[][]?} previousState
 */
function mapKeyToKeyboard(keys, previousState){
    return keys.map((row, rowIndex) => {
        return row.map((keyValue, keyValueIndex) => {
            if(previousState){
                return {
                    keyValue,
                    isPressed: previousState[rowIndex][keyValueIndex].isPressed
                }
            }
            return {
                keyValue,
                isPressed: false
            }
        })
    })
}

export default TypingScreen;
