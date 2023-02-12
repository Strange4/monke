
import { useState } from "react";
import './styles/GameText.css'

export default function GameText({textToDisplay}){
    const defaulDisplay = Array.from(textToDisplay).map((letter) => {
        // the type of a displayed letter can only be right | wrong | none
        return {
            letter,
            type: "none"
        }
    });
    const [inputText, setInputText] = useState("");
    const [displayText, setDisplayText] = useState(defaulDisplay);

    function rednerLetters(newInput){
        const newLetterIndex = newInput.length - 1;
        const newDisplay = displayText.slice();
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
        setDisplayText(newDisplay)
    }
    
    return (
        <>
            <div>
                {
                    displayText.map((letter, index) => {
                        return <span className={`${letter.type} letter`} key={index}>
                            {letter.letter}</span>
                    })
                }
            </div>
            
            <div>
                <input type="text" value={inputText} onChange={(e) => {
                    rednerLetters(e.target.value);
                    setInputText(e.target.value);
                }} />
            </div>
        </>
    );
}