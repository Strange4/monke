import './Layout/TypingScreen.css';
import { useState, useRef } from "react";
import VirtualKeyboard from './VirtualKeyboard';
import keyboardKeys from "../../Data/keyboard_keys.json";
import GameText from '../GameText';
import Chronometer, {useChronometer} from './Chronometer';
import SoloGameResult from './SoloGameResult';
import { useQuery } from 'react-query';
import Spinner from '../Spinner';
import { 
    renderLetters, getDefaultUserDisplay, mapKeyToKeyboard, preventDefaultBehavior, 
    randomNumber
} from './TypingUtil';
import defaultQuotes from '../../Data/default_quotes.json';

const allShiftKeys = keyboardKeys.english.upper;
const allRegKeys = keyboardKeys.english.lower;
/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 */
function TypingScreen() {
    
    const {
        isLoading, data: textToDisplay, refetch 
    } = useQuery("textToDisplay", async () => {
        return (await (await fetch("/api/quote")).json()).body;
    }, {onSuccess: (quote) => {
        setUserDisplay(getDefaultUserDisplay(quote))
    }, onError: () => {
        setUserDisplay(getDefaultUserDisplay(defaultQuotes[randomNumber(0, defaultQuotes.length)]))
    },
    refetchOnWindowFocus: false});
    const [keyboard, setKeyboard] = useState(mapKeyToKeyboard(allRegKeys));
    const [displayTime, setDisplayTime] = useState(0);
    const [displayResults, setDisplayResults] = useState(false);
    const { startTimer, stopTimer, resetTimer, timer } = useChronometer(setDisplayTime);
    const [userDisplay, setUserDisplay] = useState(getDefaultUserDisplay(textToDisplay));
    const textContainerRef = useRef();

    function handleGameEnd(){
        stopTimer();
        setDisplayResults(true);
        setUserDisplay([]);
        refetch();
    }
    
    function resetGame(){
        setDisplayResults(false);
        resetTimer();
        textContainerRef.current.value = "";
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
            {isLoading ?
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

export default TypingScreen;
