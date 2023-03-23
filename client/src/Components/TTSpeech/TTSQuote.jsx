import Speech from "react-speech";
import { useRef, useEffect, useState } from "react";

/**
 * React component that converts a quote spoken words using the 'react-speech' library.
 * @param {string} text - Text to be read by react-speech.
 * @param {boolean} resultScreenOff - Flag indicating if result screen is active.
 * @param {boolean} enabled - Flag indicating if the user enbled the TTS feature.
 * @returns {ReactElement|null} - If result screen inactive and TTS enabled, returns TTS component.
 * Returns null if TTS is not enabled or result screen is active.
 */
function TTSQuote({ text, resultScreenOff, enabled }){

    const [isMounted, setIsMounted] = useState(false);
    const speechRef = useRef();

    useEffect(() => {
        if(resultScreenOff && enabled){
            setIsMounted(true);
        }
    }, [resultScreenOff, enabled]);

    useEffect(() => {
        if(speechRef.current && isMounted){
            speechRef.current.play();
            setIsMounted(false);
        }
    }, [isMounted]);

    return isMounted ? <Speech ref={speechRef} text={text}/> : null;
}

export default TTSQuote;