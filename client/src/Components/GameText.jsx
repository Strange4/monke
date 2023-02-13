
import { useState } from "react";
import './Styles/GameText.css';


function useGameText(textToDisplay) {
    const defaultDisplay = Array.from(textToDisplay).map((letter) => {
        // the type of a displayed letter can only be right | wrong | none
        return {
            letter,
            type: "none"
        }
    });
    const [display, setDisplay] = useState(defaultDisplay);
        
    function rednerLetters(newInput){
        const newLetterIndex = newInput.length - 1;
        const newDisplay = display.slice();
        // are are setting all the next letters that could posibly be deleted to none.
        for(let i = newLetterIndex + 1;i < newDisplay.length;i++){
            newDisplay[i].type = "none";
        }
    
        // only change it if there is stuff in the input
        if(newInput.length !== 0 && newInput.length <= newDisplay.length){
            if(newDisplay[newLetterIndex].letter === newInput[newLetterIndex]){
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