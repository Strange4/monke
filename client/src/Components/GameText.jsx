import './Styles/GameText.css';

function GameText({display}) {

    const caret = <span id="inputCaret"></span>;

    return (
        <div className="letter-container">
            
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
    );
}

export default GameText;