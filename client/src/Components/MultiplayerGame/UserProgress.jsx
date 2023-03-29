function GameProgress(props) {
    return (
        <div id="progress-bar"
            style={{
                backgroundColor: props.color || "yellow",
                width: `${Math.round(props.progress)}%`
            }}>
        </div>
    );
}

export default GameProgress;