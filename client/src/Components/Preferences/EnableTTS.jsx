function EnableTTS({ enabled, changeOption }){
    return(
        <div id="enable-tts" className="pref-group">
            <p>Text-To-Speech for quotes</p>
            <div className="pref-btns">
                <div className="pref-btn-group">
                    <input type={"radio"} id="TTSQuoteOn" name="enableTTSQuote" value={"true"}
                        checked={enabled === "true"} onChange={changeOption} />
                    <label htmlFor="TTSQuoteOn">Enable</label>
                </div>
                <div className="pref-btn-group">
                    <input type={"radio"} id="TTSQuoteOff" name="enableTTSQuote" value={"false"}
                        checked={enabled === "false"} onChange={changeOption} />
                    <label htmlFor="TTSQuoteOff">Disable</label>
                </div>
            </div>
        </div>
    );
}

export default EnableTTS;