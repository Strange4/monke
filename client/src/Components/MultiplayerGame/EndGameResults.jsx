const EndGameResults = (props) => {
    return (
        <div id="game-results" className="player-info">
            <img className="player-image" src={`${props.avatar}`} />
            <p className='player-name'> {props.name} </p>
            {props.ended ?
                <div id="game-single-result">
                    <p>
                        RANK: {props.rank + 1}
                    </p>
                    <p>
                        wpm: {props.wpm}
                    </p>
                    <p>
                        acc: {props.acc}
                    </p>
                    <p>
                        score: {Math.round(props.wpm * props.acc)}
                    </p>
                </div>
                :
                <div id="game-single-result">
                    <p> User did not finish </p>
                </div>
            }
        </div>
    );
}

export default EndGameResults;