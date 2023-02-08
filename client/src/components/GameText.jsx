
import { useEffect, useState } from "react";

export default function GameText({textToDisplay}){
    const defaulDisplay = Array.from(textToDisplay).map((letter, index) => {
        return <span key={index}>{letter}</span>
    });
    const [inputText, setInputText] = useState("");
    const [displayText, setDisplayText] = useState(defaulDisplay);
    useEffect(()=>{
        const newDisplay = displayText.slice();
        for(let letterIndex in textToDisplay){
            const inputLetter = inputText[letterIndex];
            const displayLetter = textToDisplay[letterIndex];
            
            if(inputLetter === displayLetter){
                newDisplay[letterIndex] = <span key={letterIndex} className="right">{displayLetter}</span>
            } else {
                newDisplay[letterIndex] = <span key={letterIndex} className="wrong">{displayLetter}</span>
            }
        }
        setDisplayText(newDisplay);
        
    }, [inputText]);

    function rednerLetters(){
        
    }
    
    return (
        <>
            <div>
                {displayText}
            </div>
            
            <div>
                <input type="text" onChange={(e) => {
                    setInputText(e.target.value)
                }} />
            </div>
        </>
    );
}