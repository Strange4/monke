import "./Layout/Chronometer.css";
import { Timer } from "timer-node";
import { useEffect, useRef, useState } from "react";

/**
 * Renders a timer displaying the number of seconds
 * that went by since the timer's first start.
 * @param {*} props 
 * @returns {ReactElement}
 */
function Chronometer({ seconds }) {
    return (
        <div id="chronometer">
            <p><span id="seconds">{seconds}</span></p>
        </div>
    );
}


function useChronometer(setSeconds){
    const timer = useRef(new Timer());
    const [timerState, setTimerState] = useState("stopped");
    const intervalID = useRef();
    useEffect(() => {
        console.log(timerState);
        if(timerState === "started" && !timer.current.isStarted()){
            timer.current.start();
            intervalID.current = setInterval(() => {
                const currentTime = timer.current.time().s;
                setSeconds(currentTime);
            }, 1000);
            return;
        }
        if(timerState === "stopped"){
            if(!intervalID.current){
                return;
            }
            clearInterval(intervalID);
        }
        return () => {
            if(!intervalID.current){
                return;
            }
            clearInterval(intervalID);
        }
    }, [timerState])
    const startTimer = () => {
        setTimerState("started");
    }

    const stopTimer = () => {
        timer.current.stop();
        setTimerState("stopped");
    }

    const resetTimer = () => {
        timer.current.clear();
        setTimerState("stopped");
    }

    return {startTimer, stopTimer, resetTimer}
}

export default Chronometer;
export {useChronometer};