
import { useState } from "react";
import './Styles/GameText.css';


export default function useGameText(textToDisplay) {
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
        /// this is really inneficient and can be sped up by dividing using words
        for(let i = newLetterIndex + 1;i < newDisplay.length;i++){
            newDisplay[i].type = "none";
        }
    
        // only change it if there is stuff in the input
        if(newInput.length !== 0){
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