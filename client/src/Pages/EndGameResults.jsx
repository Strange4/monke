const EndGameResults = (props) => {
    return (
        <div id="game-results" className="player-info">
            <img className="player-image" src={`${props.avatar}`} />
            <p className='player-name'> {props.name} </p>
            <div id="game-single-result">
                {props.wpm !== undefined ?
                    <p> wpm: {props.wpm} accuracy: {props.acc} score: {Math.round(props.wpm*props.acc)}</p>
                    :
                    <p> User still in progress...</p>
                }
            </div>
        </div>
    );
}

export default EndGameResults;