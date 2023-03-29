function TssSpeed({speed, changeOption}){
    return(
        <>
            <p>Text-To-Speech speed</p>
            <input type={"radio"} id="tssSpeedSlow" name="tssSpeed" value={"0.7"}
                checked={speed === "0.7"} onChange={changeOption} />
            <label htmlFor="tssSpeedSlow">Slow</label>

            <input type={"radio"} id="tssSpeedNorm" name="tssSpeed" value={"1"}
                checked={speed === "1"} onChange={changeOption} />
            <label htmlFor="tssSpeedNorm">Normal</label>

            <input type={"radio"} id="tssSpeedFast" name="tssSpeed" value={"1.3"}
                checked={speed === "1.3"} onChange={changeOption} />
            <label htmlFor="tssSpeedFast">Fast</label>
        </>
    );
}

export default TssSpeed;