import Speech from "react-speech";
import { useRef, useEffect, useState } from "react";

/**
 * React component that converts a quote spoken words using the 'react-speech' library.
 * @param {string} text - Text to be read by react-speech.
 * @param {boolean} resultScreenOff - Flag indicating if result screen is active.
 * @param {boolean} enabled - Flag indicating if the user enbled the TTS feature.
 * @returns {ReactElement} - If result screen inactive and TTS enabled, returns TTS component.
 */
function TTSQuote({ text, resultScreenOff, enabled }){

    const [isMounted, setIsMounted] = useState(false);
    const speechRef = useRef();

    useEffect(() => {
        resultScreenOff && enabled ? setIsMounted(true) : setIsMounted(false);
    }, [resultScreenOff, enabled]);

    useEffect(() => {
        if(speechRef.current && isMounted){
            playQuote();
        }
    }, [isMounted]);

    function playQuote(){
        speechRef.current.play();
    }

    return isMounted && <Speech ref={speechRef} text={text}
        displayText="Replay quote"
        textAsButton={true}
        onKeyUp={(e) => {
            if(e.key === 'Enter'){
                playQuote();
            }
        }}
    />;
}

export default TTSQuote;