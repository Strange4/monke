
import { useState } from "react";
import './Styles/GameText.css';
// import useRect from "./useRect";


function useGameText(textToDisplay) {
    const defaultDisplay = Array.from(textToDisplay).map((letter) => {
        return {
            letter,
            type: "none",
            current: false
        }
    });
    defaultDisplay[0].current = true;
    const [display, setDisplay] = useState(defaultDisplay);
    /**
     * changes the type (right | wrong | none) of the display of letters based on the user input
     * @param {string} newInput the new input that has been changed by the user
     */
    function rednerLetters(newInput){
        const newLetterIndex = newInput.length - 1;
        const newDisplay = display.slice();

        // are are setting all the next letters that could posibly be deleted to none.
        for(let i = newLetterIndex + 1;i < newDisplay.length;i++){
            newDisplay[i].type = "none";
            newDisplay[i].current = false;
        }
        
        const inputIsEmpty = newInput.length === 0;
        const inputIsDone = newInput.length === newDisplay.length;
        if(!inputIsDone){
            newDisplay[newLetterIndex + 1].current = true;
        }
        // only change the type if there is stuff in the input
        if(!inputIsEmpty && !inputIsDone){
            const newLetter = newDisplay[newLetterIndex];
            newLetter.current = false;
            if(newLetter.letter === newInput[newLetterIndex]){
                newLetter.type = "right";
            } else if(newLetter.letter !== " " ) {
                newLetter.type = "wrong";
            }
        }
        setDisplay(newDisplay);
    } 

    const caret = 
    <span id="inputCaret">
        
    </span>;

    const letters = 
    <div className="letterContainer">
        
        {
            display.map((letter, index) => {
                return (
                    <span 
                        key={index + letter}
                        className={`${letter.type} letter ${letter.current}`} >
                        {letter.current ? caret : undefined}
                        {letter.letter}
                    </span>
                )
            })
        }
    </div>;
        
    return [letters, rednerLetters];
}

export default useGameText;