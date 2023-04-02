import { useRef } from 'react';
import '../Styles/GameText.css';
/**
 * 
 * @param {{display: {letter: string; type: string; current: boolean; }[]}} param0 
 * @returns 
 */
function GameText({ display, isFocused, onClick }) {
    const caretRef = useRef();
    const currentLetterRef = useRef();

    // shout out to noah for coming in clutch with a big brain idea
    requestAnimationFrame(() => {
        if (!caretRef.current || !currentLetterRef.current) {
            return;
        }
        const currentLetter = currentLetterRef.current;
        const rect = caretRef.current.getBoundingClientRect();
        const height = rect.height;
        const width = rect.width;
        const top = currentLetter.offsetTop - height / 8;
        const left = currentLetter.offsetLeft - width;
        caretRef.current.style.top = `${top}px`;
        caretRef.current.style.left = `${left}px`;
    });
    return (
        <div id="typing-container"
            style={{ cursor: isFocused ? 'none' : 'auto' }}>
            <div
                style={{ display: isFocused ? 'none' : 'inline-block' }}
                onClick={onClick}
                id="text-focus-message">
                👆 Click here to start typing
            </div>
            <div
                id="typing-screen-text"
                onClick={onClick}
                className={isFocused ? 'letter-container' : 'blurred-container letter-container'}>
                <span ref={caretRef} id="inputCaret"></span>
                {
                    display.map((letter, index) => {
                        return (
                            <span
                                ref={letter.current ? currentLetterRef : undefined}
                                key={index}
                                className={`${letter.type} letter ${letter.current}`} >
                                {letter.letter}
                            </span>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default GameText;