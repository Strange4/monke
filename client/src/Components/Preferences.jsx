import './Styles/Popup.css';
import { useState, useEffect, useRef } from 'react';
import {setCookie, getCookieValue, deleteCookie} from '../Controller/CookieClass'
import Popup from 'reactjs-popup';

function Preferences({open, toggleShow}){

    /**
     * Define states for all preferences and their default values
     */
    const [enableTTSQuote, setEnableTTSQuote] = useState("false")
    const [tssSpeed, setTssSpeed] = useState("1");

    const popupRef = useRef(null);

    /**
     * Used to facilitate handling changing preferences,
     * saving/loading all preferences by looping through all entries
     */
    const stateMap = {
        "enableTTSQuote": {
            state: enableTTSQuote,
            setter: setEnableTTSQuote
        },
        "tssSpeed": {
            state: tssSpeed,
            setter: setTssSpeed
        }
    }

    /**
     * Will handle changing the state of preference value.
     * The target's name value will be retrieved and used to reference the
     * appropriate state setting function in the stateMap object.
     * @param {*} event
     */
    function handlePrefChange(event){
        const stateSetter = stateMap[event.target.name].setter;
        stateSetter(event.target.value);
    }

    /**
     * Save states of all values to cookie
     * @param {*} event 
     */
    function handleSavePref(event){
        event.preventDefault();
        Object.keys(stateMap).forEach(key => {
            deleteCookie(key);
            setCookie(key, stateMap[key].state);
        });

        popupRef.current.close();
    }

    /**
     * loads preferences from cookies
     */
    function handleLoadPref(){
        Object.keys(stateMap).forEach(key => {
            const cookieValue = getCookieValue(key);
            if(cookieValue !== undefined){
                const stateSetter = stateMap[key].setter;
                stateSetter(cookieValue);
            }
        });
    }

    useEffect(() => {
        if(open){
            handleLoadPref();
        }
    }, [open]);

    return(
        <Popup open={open} modal onClose={toggleShow} ref={popupRef}>
            <form onSubmit={handleSavePref}>
                <div className="popup">
                    <h1>Accessibility</h1>
                    <div id="TTSQuote-pref">
                        <p>Enable Text-To-Speech for quotes</p>
                        <input type={"radio"} id="TTSQuoteOn" name="enableTTSQuote" value={"true"}
                            checked={enableTTSQuote === "true"} onChange={handlePrefChange} />
                        <label htmlFor="TTSQuoteOn">Enable</label>

                        <input type={"radio"} id="TTSQuoteOff" name="enableTTSQuote" value={"false"}
                            checked={enableTTSQuote === "false"} onChange={handlePrefChange} />
                        <label htmlFor="TTSQuoteOff">Disable</label>

                        <p>Text-To-Speech speed</p>
                        <input type={"radio"} id="tssSpeedSlow" name="tssSpeed" value={"0.7"}
                            checked={tssSpeed === "0.7"} onChange={handlePrefChange} />
                        <label htmlFor="tssSpeedSlow">Slow</label>

                        <input type={"radio"} id="tssSpeedNorm" name="tssSpeed" value={"1"}
                            checked={tssSpeed === "1"} onChange={handlePrefChange} />
                        <label htmlFor="tssSpeedNorm">Normal</label>

                        <input type={"radio"} id="tssSpeedFast" name="tssSpeed" value={"1.3"}
                            checked={tssSpeed === "1.3"} onChange={handlePrefChange} />
                        <label htmlFor="tssSpeedFast">Fast</label>
                    </div>
                    <button type="submit">Save preferences</button>
                </div>
            </form>
        </Popup>
    );
}

export default Preferences;