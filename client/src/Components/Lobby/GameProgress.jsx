function GameProgress(props) {
    const colors = ["green", "red", "blue", "yellow", "orange"]

    return (
        <div id="progress-bar"
            style={{
                backgroundColor: colors[props.index],
                width: 10 * props.progress
            }}>
            {props.progress}
        </div>
    )
}

export default GameProgress