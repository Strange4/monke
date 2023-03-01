/**
 * prevents the deafult behavior from an event
 * @param {Event} e the event to prevent
 */
export function preventDefaultBehavior(e){
    e.preventDefault();
}


/**
 * changes the type (right | wrong | none) of the display of letters based on the user input
 * @param {string} newInput the new input that has been changed by the user
 * @param {{ letter: string; type: string; current: boolean; }[]} display the current display state
 */
export function renderLetters(newInput, display) {
    const newLetterIndex = newInput.length - 1;
    const newDisplay = display;

    // are are setting all the next letters that could posibly be deleted to none.
    for (let i = newLetterIndex + 1; i < newDisplay.length; i++) {
        newDisplay[i].type = "none";
        newDisplay[i].current = false;
    }
    
    const inputIsEmpty = newInput.length === 0;
    const inputIsDone = newInput.length > newDisplay.length;
    // if the input is done don't do anything
    if(inputIsDone){
        return display;
    }
    const nextLetter = newDisplay[newLetterIndex + 1];
    if(nextLetter){
        nextLetter.current = true;
    }

    if(!inputIsEmpty){
        const newLetter = newDisplay[newLetterIndex];
        newLetter.current = false;
        if(newLetter.letter === newInput[newLetterIndex]){
            newLetter.type = "right";
        } else {
            newLetter.type = "wrong";
        }
    }
    return newDisplay;
}

/**
 * Get's the default user display filler with letter object with type none.
 * @param {string} stringToDisplay the original string that needs to be transformed
 */
export function getDefaultUserDisplay(stringToDisplay) {
    if(!stringToDisplay){
        return [];
    }
    const display = Array.from(stringToDisplay).map((letter) => {
        // the type of a displayed letter can only be right | wrong | none
        return {
            letter,
            type: "none",
            current: false
        }
    });
    if(display[0]){
        display[0].current = true;
    }
    return display;
}

/**
 * maps keyboard keys to an array of pressed and unpressed keys
 * if a prevous state if defined, maps the new keys to the previous state (pressed or unpressed)
 * @param {string[][]} keys the keys that need to me mapped
 * @param {{ keyValue: string; isPressed: boolean; }[][]?} previousState
 */
export function mapKeyToKeyboard(keys, previousState){
    return keys.map((row, rowIndex) => {
        return row.map((keyValue, keyValueIndex) => {
            if(previousState){
                return {
                    keyValue,
                    isPressed: previousState[rowIndex][keyValueIndex].isPressed
                }
            }
            return {
                keyValue,
                isPressed: false
            }
        })
    })
}