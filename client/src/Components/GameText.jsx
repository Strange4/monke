import './Styles/GameText.css';

function GameText({ display, isFocused, onClick }) {

    const caret = <span id="inputCaret"></span>;

    return (
        <div id="typing-container">
            <div
                style={{display: isFocused ? 'none' : 'inline-block' }}
                onClick={onClick} 
                id="text-focus-message">
                👆 Click here to start typing
            </div>
            <div
                id="typing-screen-text"
                onClick={onClick} 
                className={isFocused ? 'letter-container' : 'blurred-container letter-container'}>
                {
                    display.map((letter, index) => {
                        return (
                            <span
                                key={index}
                                className={`${letter.type} letter ${letter.current}`} >
                                {letter.current ? caret : undefined}
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