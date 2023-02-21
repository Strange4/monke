import './Styles/GameText.css';
import { useState } from "react";

function useGameText(userDisplay, setUserDisplayText) {
    const [display, setDisplay] = useState(userDisplay);

    /**
     * changes the type (right | wrong | none) of the display of letters based on the user input
     * @param {string} newInput the new input that has been changed by the user
     */
    function renderLetters(newInput) {
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
        setUserDisplayText(newDisplay);
    }

    let letters =
        <div>
            {display.map((letter, index) => {
                return <span className={`${letter.type} letter`} key={index}>
                    {letter.letter}</span>
            })}
        </div>
    return [letters, renderLetters];
}

export default useGameText;