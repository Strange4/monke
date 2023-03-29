function GameProgress(props) {
    const colors = ["green", "red", "blue", "yellow", "orange"];

    return (
        <div id="progress-bar"
            style={{
                backgroundColor: colors[props.index],
                width: Math.round(props.progress) * 5.7
            }}>
            
            {/* {props.progress} */}
        </div>
    );
}

export default GameProgress;