import { useState } from "react";
import './Styles/GameText.css';
import Timer from "timer-machine";

function useGameText(textToDisplay, timer, setTimer, setDisplayTime, displayTime, setPopup, setResults) {
    const updateRate = 1000
    const defaultDisplay = Array.from(textToDisplay).map((letter) => {
        // the type of a displayed letter can only be right | wrong | none
        return {
            letter,
            type: "none"
        }
    });
    const [display, setDisplay] = useState(defaultDisplay);

    function setupTimer() {
        let interval;
        timer.on('start', function () {
            setDisplayTime({"seconds": Math.floor(timer.time() / updateRate)})
            interval = setInterval(timer.emitTime.bind(timer), updateRate)
            setPopup(false)
        })
        timer.on('stop', function () {
            setTimer(timer)
            setDisplayTime({"seconds": Math.floor(timer.time() / updateRate)})
            setTimer(new Timer())
            clearInterval(interval)
            setPopup(true)
            computeResults()
        })
        timer.on('time', function (time) {
            setDisplayTime({"seconds": Math.floor(time / updateRate)})
        })
    }

    function computeResults() {
        let nbWords = textToDisplay.split(" ").length;
        let minutes = timer.time() / 60000;
        let wpm = nbWords / minutes;
        setResults({
            "time": Math.round((timer.time() / 1000) * 100) / 100,
            "wpm": Math.round(wpm * 100) / 100,
            "accuracy": Math.round(computeAccuracy() * 100) / 100
        });
    }

    function computeAccuracy() {
        let wrongCount = 0;
        let rightCount = 0;
        display.forEach(letter => {
            if (letter.type === "right") {
                rightCount++;
            } else if (letter.type === "wrong") {
                wrongCount++;
            }
        });
        let accuracy = (rightCount / (rightCount + wrongCount)) * 100;
        if (wrongCount === 0) {
            accuracy = 100;
        }
        return accuracy;
    }

    function handleTimer(newInput) {
        if (!timer.isStarted() && display.length > newInput.length + 1) {
            setupTimer()
        }
        if (newInput.length === 1 && !timer.isStarted()) {
            timer.start()
        } else if (display.length === newInput.length && timer.isStarted()) {
            timer.stop()
        }
    }

    /**
     * changes the type (right | wrong | none) of the display of letters based on the user input
     * @param {string} newInput the new input that has been changed by the user
     */
    function rednerLetters(newInput) {
        handleTimer(newInput);

        const newLetterIndex = newInput.length - 1;
        const newDisplay = display.slice();
        // are are setting all the next letters that could posibly be deleted to none.
        for (let i = newLetterIndex + 1; i < newDisplay.length; i++) {
            newDisplay[i].type = "none";
        }

        // only change the type if there is stuff in the input
        if (newInput.length !== 0 && newInput.length <= newDisplay.length) {
            if (newDisplay[newLetterIndex].letter === newInput[newLetterIndex]) {
                newDisplay[newLetterIndex].type = "right";
            } else {
                newDisplay[newLetterIndex].type = "wrong";
            }
        }
        setDisplay(newDisplay);
    }

    let letters =
        <div>
            {
                display.map((letter, index) => {
                    return <span className={`${letter.type} letter`} key={index}>
                        {letter.letter}</span>
                })
            }
        </div>;
    return [letters, rednerLetters];
}

export default useGameText;