import Speech from "react-speech";
import { useRef, useEffect, useState } from "react";

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