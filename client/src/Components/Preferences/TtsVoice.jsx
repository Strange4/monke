function TtsVoice({ selected, changeOption }){

    // Thanks OpenAI for providing me the
    // information to get a list of available voices
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    return(
        <div id="tts-voice">
            <p>Text-To-Speech voice</p>
            <select id="voice-dropdown" value={selected} onChange={changeOption} name="ttsVoice">
                {
                    voices.map(voice =>
                        <option key={voice.name} value={voice.name}>{voice.name}</option>
                    )
                }
            </select>
        </div>
    );
}

export default TtsVoice;