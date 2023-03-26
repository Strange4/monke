function EnableTTS({ enabled, changeOption }){
    return(
        <>
            <p>Enable Text-To-Speech for quotes</p>
            <input type={"radio"} id="TTSQuoteOn" name="enableTTSQuote" value={"true"}
                checked={enabled === "true"} onChange={changeOption} />
            <label htmlFor="TTSQuoteOn">Enable</label>

            <input type={"radio"} id="TTSQuoteOff" name="enableTTSQuote" value={"false"}
                checked={enabled === "false"} onChange={changeOption} />
            <label htmlFor="TTSQuoteOff">Disable</label>
        </>
    );
}

export default EnableTTS;