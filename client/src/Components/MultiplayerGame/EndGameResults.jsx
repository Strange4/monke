const EndGameResults = (props) => {
    return (
        <div id="game-results" className="player-info">
            <img className="player-image" src={`${props.avatar}`} />
            <p className='player-name'> {props.name} </p>
            <div id="game-single-result">
                {props.ended ?
                    <p>
                        RANK: {props.rank + 1}
                        wpm: {props.wpm}
                        accuracy: {props.acc}
                        score: {Math.round(props.wpm * props.acc)}
                    </p>
                    :
                    <p> User still in progress...</p>
                }
            </div>
        </div>
    );
}

export default EndGameResults;