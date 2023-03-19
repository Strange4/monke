function GameProgress(props) {
    const colors = ["green", "red", "blue", "yellow", "orange"]

    return (
        <div id="progress-bar"
            style={{
                backgroundColor: colors[props.index]
            }}>
            {props.progress}
        </div>
    )
}

export default GameProgress