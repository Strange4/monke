const EndGameResults = (props) => {
    return (
        <div id="game-results" className="player-info">
            <img className="player-image" src={`${props.avatar}`} />
            <p className='player-name'>
                {props.name}
            </p>
            <div id="game-single-result">
                <p> wpm: {props.wpm}</p>
                <p> accuracy: {props.acc}</p>
            </div>
        </div>
    );
}

export default EndGameResults;