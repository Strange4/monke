import Speech from "react-speech";
import { useRef, useEffect, useContext, useState } from "react";
import PreferenceContext from "../../Context/PreferenceContext";

/**
 * React component that converts a quote to spoken words using the 'react-speech' library.
 * @param {string} text - Text to be read by react-speech.
 * @returns {ReactElement} - If context state enableTTSQuote is "true", returns TTS component.
 */
function TTSQuote({ text }) {

    const prefContext = useContext(PreferenceContext);
    const speechRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (speechRef.current) {
            setIsPlaying(true);
        }
    }, [text, prefContext.enableTTSQuote]);

    /**
     * function that invokes react-speech to read out the text.
     * Invoked automatically upon being mounted.
     * User can invoke it either by clicking the replay button or pressing enter when it is focused
     */
    function playQuote() {
        speechRef.current.play();
    }

    useEffect(() => {
        if (isPlaying) {
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
        voice={prefContext.ttsVoice}
        onKeyUp={(e) => {
            if (e.key === 'Enter') {
                playQuote();
            }
        }}
    />;
}

export default TTSQuote;