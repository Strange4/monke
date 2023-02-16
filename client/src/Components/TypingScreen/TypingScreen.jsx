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
import * as FetchModule from '../../Controller/FetchModule'


/**
 * Container for the Textarea and the virtual keyboard
 * @returns {ReactElement}
 * @author Rim Dallali
 */
function TypingScreen() {
    const textToDisplay = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";
    const [timer, setTimer] = useState(new Timer());
    const [displayTime, setDisplayTime] = useState({ "seconds": 0})
    const [popup, setPopup] = useState(false);
    const [results, setResults] = useState({"time": 0, "wpm": 0, "accuracy": 0})
    let textContainerRef = useRef();
    const keyRefs = useRef(new Map());
    const [GameText, updateGameText] = useGameText(
        textToDisplay, timer, setTimer, setDisplayTime, setPopup, textContainerRef, postUserStats);

    function mapKeys(letter, virtualKey) {
        keyRefs.current.set(letter, virtualKey);
    }

    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;

    const [keyboard, setKeyboard] = useState(allRegKeys);

    function onChangeText(currentText) {
        updateGameText(currentText);
    }

    function cleanVirtualKeyboard() {
        keyRefs.current.forEach(key => {
            key.current.classList.remove("pressed")
        })
    }

    /**
     * Sends data to the post api for a user's solo game
     * TODO change the username to be the real username 
     * once login is implemented
     * @param {Object} result 
     */
    function postUserStats(result) {
        cleanVirtualKeyboard()
        setResults(result)
        let userStats = {
            "username": "john",
            "wpm": result.wpm,
            "accuracy": result.accuracy,
            "win": 0,
            "lose": 0,
            "draw": 0
        }
        FetchModule.postUserStatAPI("/api/user_stat", userStats)
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
            <Popup open={popup} position="center" modal>
                <SoloGameResult time={results.time} wpm={results.wpm} accuracy={results.accuracy}/>
            </Popup>
        </div>
    );
}

export default TypingScreen;
