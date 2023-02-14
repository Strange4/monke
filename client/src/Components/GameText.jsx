import { useState } from "react";
import './Styles/GameText.css';
import "timer-machine";

function useGameText(textToDisplay, timer, setTimer, setDisplayTime) {
    const defaultDisplay = Array.from(textToDisplay).map((letter) => {
        // the type of a displayed letter can only be right | wrong | none
        return {
            letter,
            type: "none"
        }
    });
    const [display, setDisplay] = useState(defaultDisplay);
    function setupTimer() {
        timer.on('start', function () {
            setTimer(timer)
            setDisplayTime({ "seconds": (timer.time() / 1000), "state": "started" })
        })
        timer.on('stop', function () {
            setTimer(timer)
            setDisplayTime({ "seconds": (timer.time() / 1000), "state": "stopped" })
        })
    }

    /**
     * changes the type (right | wrong | none) of the display of letters based on the user input
     * @param {string} newInput the new input that has been changed by the user
     */
    function rednerLetters(newInput) {
        if (!timer.isStarted()) {
            setupTimer()
        }

        if (newInput.length === 1 && !timer.isStarted()) {
            console.log("starting timer")
            timer.start()
        } else if (display.length === newInput.length + 1 && timer.isStarted()) {
            console.log("stopping at: " + timer.time())
            timer.stop()
        }
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