function TtsVoice({ selected, voices, changeOption }) {

    return(
        <>
            {
                <div id="tts-voice">
                    <p>Text-To-Speech voice</p>
                    <select id="voice-dropdown" value={selected} onChange={changeOption}
                        name="ttsVoice">
                        {
                            voices.map(voice =>
                                <option key={voice.name} value={voice.name}>{voice.name}</option>
                            )
                        }
                    </select>
                </div> 
            }
        </>
    );
}

export default TtsVoice;