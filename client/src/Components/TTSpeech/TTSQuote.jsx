import Speech from "react-speech";
import { useRef, useEffect, useContext, useState } from "react";
import PreferenceContext from "../../Context/PreferenceContext";

/**
 * React component that converts a quote spoken words using the 'react-speech' library.
 * @param {string} text - Text to be read by react-speech.
 * @param {boolean} resultScreenOff - Flag indicating if result screen is active.
 * @param {boolean} enabled - Flag indicating if the user enbled the TTS feature.
 * @returns {ReactElement} - If result screen inactive and TTS enabled, returns TTS component.
 */
function TTSQuote({ text }){

    const prefContext = useContext(PreferenceContext);
    const speechRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if(speechRef.current){
            setIsPlaying(true)
        }
    }, [text, prefContext.enableTTSQuote, isPlaying]);

    /**
     * function that invokes react-speech to read out the text.
     * Invoked automatically upon being mounted.
     * User can invoke it either by clicking the replay button or pressing enter when it is focused
     */
    function playQuote(){
        speechRef.current.play();
    }

    useEffect(() => {
        if(isPlaying){
            playQuote();
        }
        return () => {
            setIsPlaying(false);
        }
    }, [isPlaying]);

    return prefContext.enableTTSQuote === "true" && <Speech ref={speechRef} text={text}
        displayText="Replay quote"
        textAsButton={true}
        rate={prefContext.ttsSpeed}
        onKeyUp={(e) => {
            if(e.key === 'Enter'){
                playQuote();
            }
        }}
    />;
}

export default TTSQuote;