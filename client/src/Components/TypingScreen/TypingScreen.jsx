import './Layout/TypingScreen.css';
import { useState, useRef, useContext, useEffect } from "react";
import VirtualKeyboard from './VirtualKeyboard';
import keyboardKeys from "../../Data/keyboard_keys.json";
import GameText from '../GameText';
import Chronometer, { useChronometer } from './Chronometer';
import SoloGameResult from './SoloGameResult';
import { useQuery } from 'react-query';
import Spinner from '../Spinner';
import SocketContext from '../../Context/SocketContext';
import {
    renderLetters, getDefaultUserDisplay, mapKeyToKeyboard, preventDefaultBehavior,
    randomNumber
} from './TypingUtil';
import defaultQuotes from '../../Data/default_quotes.json';
import TTSQuote from '../TTSpeech/TTSQuote';

const allShiftKeys = keyboardKeys.english.upper;
const allRegKeys = keyboardKeys.english.lower;

/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 */
function TypingScreen(props) {

    const { isLoading, refetch } = useQuery("textToDisplay", async () => {
        if(props.multiplayer) {
            return props.quote
        }
        const resp = await fetch("/api/quote",
            {
                headers: { 'Accept': 'application/json', "Content-Type": "application/json" }
            });
        if(!resp.ok){
            throw new Error("The fetch request failed");
        }
        return (await resp.json()).body;
    }, {
        onSuccess: (quote) => {
            setTextToDisplay(props.quote || quote);
            setUserDisplay(getDefaultUserDisplay(props.quote || quote));
        }, onError: () => {
            const quote = props.quote || defaultQuotes[randomNumber(0, defaultQuotes.length)];
            setTextToDisplay(quote);
            setUserDisplay(getDefaultUserDisplay(quote));
        },
        refetchOnWindowFocus: false
    });
    const [textToDisplay, setTextToDisplay] = useState("");
    const [keyboard, setKeyboard] = useState(mapKeyToKeyboard(allRegKeys));
    const [displayTime, setDisplayTime] = useState(0);
    const [displayResults, setDisplayResults] = useState(false);
    const { startTimer, stopTimer, resetTimer, timer } = useChronometer(setDisplayTime);
    const [userDisplay, setUserDisplay] = useState(getDefaultUserDisplay(textToDisplay));
    const [enableTTS, setEnableTTS] = useState(false);
    const [isFocused, setIsFocused] = useState(true);
    const textContainerRef = useRef();
    const socketContext = useContext(SocketContext);

    useEffect(() => {
        if (props.multiplayer) {
            startTimer();
        }
    }, []);

    /**
     * Stops the timer and displays result
     */
    function handleGameEnd() {
        stopTimer();
        setDisplayResults(true);
        if (!props.multiplayer) {
            refetch();
            resetGame();
        }
    }

    /**
     * Reset the timer and typing screen
     */
    function resetGame() {
        setDisplayResults(false);
        resetTimer();
        textContainerRef.current.value = "";
    }

    /**
     * Changes the game state according to the current text progress.
     * @param {InputEvent} e 
     */
    function onChangeText(e) {
        const current = e.target.value;
        let progress = current.length / userDisplay.length * 100;

        if (progress === 100) {
            handleGameEnd();
        }
        if (props.multiplayer) {
            socketContext.socket.current.emit("update-progress-bar", progress);
        } else if (current.length === 1) {
            startTimer();
        }
        renderLetters(current, userDisplay);
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
                if (key.keyValue === keyValue) {
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
                if (key.keyValue === keyValue) {
                    key.isPressed = true;
                }
            });
        });
        setKeyboard(newKeyboard);
    }

    if(isLoading){
        return <Spinner/>
    }

    function handleChkBoxEvent(e) {
        setEnableTTS(e.target.checked);
    }   

    return (
        <div>
            <div>
                <Chronometer seconds={displayTime}/>
                <GameText onClick={()=> {
                    textContainerRef.current.focus();
                    setIsFocused(true);
                }} display={userDisplay} isFocused={isFocused} />
                <VirtualKeyboard currentKeys={keyboard} />
                <TTSQuote
                    text={textToDisplay}
                    resultScreenOff={!displayResults}
                    enabled={enableTTS}
                />
                <label>!TEMPORARY! Enable text to speech</label>
                <input type="checkbox"
                    id="enableTTS"
                    name="enableTTSQuote"
                    defaultChecked={false}
                    onClick={handleChkBoxEvent}
                    onKeyUp={(e) => {
                        if(e.key === 'Enter'){
                            e.target.checked = !e.target.checked;
                            handleChkBoxEvent(e)
                        }
                    }}
                />
                <SoloGameResult
                    isOpen={displayResults}
                    displayText={userDisplay}
                    timer={timer.current}
                    originalText={textToDisplay}
                    closeWindow={resetGame}
                    multiplayer={props.multiplayer}
                />
            </div>

            <input
                onBlur={()=>setIsFocused(false)}
                autoFocus
                type="text" 
                id="typing-input-box"
                ref={textContainerRef}
                onChange={onChangeText}
                onKeyDown={handleKeyDown}
                onKeyUp={handlekeyUp}
                onPaste={preventDefaultBehavior}
                onDrag={preventDefaultBehavior}
                onDrop={preventDefaultBehavior}
                onCopy={preventDefaultBehavior}
            />
        </div>
    );
}

export default TypingScreen;
