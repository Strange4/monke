import './Layout/SoloGameResult.css';
import { useEffect, useState, useContext } from 'react';
import Popup from "reactjs-popup";
import Timer from "timer-machine";
import * as FetchModule from '../../Controller/FetchModule';
import AuthContext from '../../Context/AuthContext';

function SoloGameResult(props) {
    const [userStats, setUserStats] = useState({ "time": 0, "wpm": 0, "accuracy": 0 });
    const [popup, setPopup] = useState(false);
    const updateRate = 1000;
    const auth = useContext(AuthContext);

    useEffect(() => {
        handleTimer();
    }, [props.gameState]);

    /**
     * Handles when the timer should start, stop & reset
     * @param {*} newInput 
     */
    function handleTimer() {
        if (props.gameState === "reset") {
            setupTimer();
        } else if (props.gameState === "started") {
            props.timer.start();
        } else if (props.gameState === "stopped") {
            props.timer.stop();
            props.setGameState("reset");
        }
    }

    /**
     * Sets up the different listeners for the timer (start, stop and time)
     * Resets the solo game on stop and sends data to api for posting
     */
    function setupTimer() {
        let interval;
        props.timer.on('start', function () {
            props.setDisplayTime({ "seconds": Math.floor(props.timer.time() / updateRate) });
            interval = setInterval(props.timer.emitTime.bind(props.timer), updateRate);
            setPopup(false);
        });
        props.timer.on('stop', function () {
            props.setDisplayTime({ "seconds": Math.floor(props.timer.time() / updateRate) });
            props.setTimer(new Timer());
            clearInterval(interval);
            computeResults();
            setPopup(true);
            cleanTypingScreen()
        });
        props.timer.on('time', function (time) {
            props.setDisplayTime({ "seconds": Math.floor(time / updateRate) });
        });
    }

    /**
     * Resets the timer and text, sets the text to empty and unfocuses 
     * the text container in order to prepare for the next game.
     */
    function cleanTypingScreen() {
        props.textRef.current.value = "";
        props.textRef.current.blur();
        props.setDisplayTime({ "seconds": 0 });
        props.userDisplay.forEach(letter => {
            letter.type = "none"
        });
    }

    /**
     * Compute the results for the solo game upon end and post them
     */
    function computeResults() {
        let nbWords = props.textDisplay.split(" ").length;
        let minutes = props.timer.time() / 60000;
        let wpm = nbWords / minutes;
        let result = {
            "time": Math.round(props.timer.time() / 1000 * 100) / 100,
            "wpm": Math.round(wpm * 100) / 100,
            "accuracy": Math.round(computeAccuracy() * 100) / 100
        }
        postUserStats(result);
    }

    /**
     * computes the accuracy and returns it to the results computation
     * @returns {number}
     */
    function computeAccuracy() {
        let wrongCount = 0;
        let rightCount = 0;
        props.userDisplay.forEach(letter => {
            if (letter.type === "right") {
                ++rightCount;
            } else if (letter.type === "wrong") {
                ++wrongCount;
            }
        });
        let accuracy = rightCount / (rightCount + wrongCount) * 100;
        if (wrongCount === 0) {
            accuracy = 100;
        }
        return accuracy;
    }

    /**
     * Sends data to the post api for a user's solo game
     * TODO change the username to be the real username 
     * once login is implemented
     * @param {Object} result 
     */
    function postUserStats(result) {
        setUserStats(result);
        console.log(auth)
        let userStats = {
            "username": "john",
            "wpm": result.wpm,
            "accuracy": result.accuracy,
            "win": 0,
            "lose": 0,
            "draw": 0
        };
        FetchModule.postUserStatAPI("/api/user_stat", userStats);
    }

    return (
        <Popup open={popup} position="center" modal>
            <div id="solo-game-result">
                <h1>END Solo Game Popup</h1>
                <p>time: {userStats.time} seconds </p>
                <p>wpm: {userStats.wpm}</p>
                <p>accuracy: {userStats.accuracy}%</p>
                <p> press escape or click out of the popup to leave </p>
            </div>
        </Popup>
    );
}

export default SoloGameResult;