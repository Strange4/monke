import Speech from "react-speech";
import { useRef, useEffect, useState } from "react";

function TTSQuote({ text, resultScreenOff }){

    const [isMounted, setIsMounted] = useState(false);
    const speechRef = useRef();

    useEffect(() => {
        if(resultScreenOff){
            setIsMounted(true);
        }
    }, [resultScreenOff]);

    useEffect(() => {
        if(speechRef.current && isMounted){
            speechRef.current.play();
            setIsMounted(false);
        }
    }, [isMounted]);

    return isMounted ? <Speech ref={speechRef} text={text}/> : null;
}

export default TTSQuote;