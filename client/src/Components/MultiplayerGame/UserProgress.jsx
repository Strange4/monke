function GameProgress(props) {
    return (
        <div id="progress-bar"
            style={{
                backgroundColor: props.color || "yellow",
                width: `${Math.round(props.progress) - 2}%`
            }}>
        </div>
    );
}

export default GameProgress;