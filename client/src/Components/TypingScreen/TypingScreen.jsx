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

    /**
     * Fetches a quote from the database depending on the settings given by the props.
     * If request fails then we get a quote from a hard coded data (default_quotes.json).
     */
    const { isLoading, refetch } = useQuery("textToDisplay", async () => {
        if (props.quote) {
            return props.quote
        }
        let url;
        if (props.quoteLength === "random"){
            url = "/api/quote";
        } else{
            url = `/api/quote?quoteLength=${props.quoteLength}`;
        }
        const resp = await fetch(url,
            {
                headers: { 'Accept': 'application/json', "Content-Type": "application/json" }
            });
        if (!resp.ok) {
            throw new Error("The fetch request failed");
        }
        return (await resp.json()).body;
    }, {
        onSuccess: (quote) => {
            let newQuote = quote;
            if (!props.punctuation){
                newQuote = quote.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");
            }
            setTextToDisplay(newQuote);
            setUserDisplay(getDefaultUserDisplay(newQuote));
        }, onError: () => {
            const quote = defaultQuotes[randomNumber(0, defaultQuotes.length)];
            let newQuote = quote;
            if (!props.punctuation){
                newQuote = quote.replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ");
            }
            setTextToDisplay(newQuote);
            setUserDisplay(getDefaultUserDisplay(newQuote));
        },
        refetchOnWindowFocus: false
    });
    const [textToDisplay, setTextToDisplay] = useState("");
    const [keyboard, setKeyboard] = useState(mapKeyToKeyboard(allRegKeys));
    const [displayTime, setDisplayTime] = useState(0);
    const [displayResults, setDisplayResults] = useState(false);
    const { startTimer, stopTimer, resetTimer, timer } = useChronometer(setDisplayTime);
    const [userDisplay, setUserDisplay] = useState(getDefaultUserDisplay(textToDisplay));
    
    const [isFocused, setIsFocused] = useState(true);
    const textContainerRef = useRef();
    const socketContext = useContext(SocketContext);


    // Refreshes the game when a setting changes.
    useEffect(() => {
        resetGame();
    }, [props.quoteLength, props.punctuation]);

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
        if(!props.multiplayer){
            setDisplayResults(true);
        }
    }

    /**
     * Reset the timer and typing screen
     */
    function resetGame() {
        refetch();
        setDisplayResults(false);
        resetTimer();
        if(textContainerRef.current){
            textContainerRef.current.focus();
            textContainerRef.current.value = "";
        }
        setIsFocused(true);
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

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div>
            <div className='center'>
                <Chronometer seconds={displayTime} />
                <GameText onClick={() => {
                    textContainerRef.current.focus();
                    setIsFocused(true);
                }} display={userDisplay} isFocused={isFocused} />
                <VirtualKeyboard currentKeys={keyboard} />
                
                <TTSQuote
                    text={textToDisplay}
                    resultScreenOff={!displayResults}
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
                onBlur={() => setIsFocused(false)}
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
