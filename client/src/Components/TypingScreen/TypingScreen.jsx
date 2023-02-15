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
    const textToDisplay = "Lorem ipsum hello world" 
    // const textToDisplay = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab pariatur laboriosam nobis, excepturi eaque adipisci amet placeat similique modi sunt suscipit. Aspernatur nam eum nesciunt excepturi maiores repellendus tenetur distinctio!";
    const [timer, setTimer] = useState(new Timer());
    const [displayTime, setDisplayTime] = useState({ "seconds": 0})
    const [popup, setPopup] = useState(false);
    const [results, setResults] = useState({"time": 0, "wpm": 0})
    let textContainerRef = useRef();
    const keyRefs = useRef(new Map());
    const [GameText, updateGameText] = useGameText(
        textToDisplay, timer, setTimer, setDisplayTime, setPopup, setResults, textContainerRef, postUserStats);

    function mapKeys(letter, virtualKey) {
        keyRefs.current.set(letter, virtualKey);
    }

    const allShiftKeys = keyboardKeys.english.upper;
    const allRegKeys = keyboardKeys.english.lower;

    const [keyboard, setKeyboard] = useState(allRegKeys);

    function onChangeText(currentText) {
        updateGameText(currentText);
    }

    function postUserStats() {
        console.log("posting")
        console.log(results)
        let userStats = {
            "username": "Bob",
            "wpm": results.wpm,
            "accuracy": results.accuracy,
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
