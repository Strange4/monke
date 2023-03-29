function GameProgress(props) {
    return (
        <div id="progress-bar"
            style={{
                backgroundColor: colors[user.color],
                width: `${Math.round(props.progress)}%`
            }}>
            
            {/* {props.progress} */}
        </div>
    );
}

export default GameProgress;