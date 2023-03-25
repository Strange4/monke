import './Styles/Popup.css';
import { useState, useEffect } from 'react';
import {setCookie, getCookieValue, deleteCookie} from '../Controller/CookieClass'

function Preferences(){

    const [enableTTSQuote, setEnableTTSQuote] = useState("false")
    const [tssSpeed, setTssSpeed] = useState("1");

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

    function handlePrefChange(event){
        const stateSetter = stateMap[event.target.name].setter;
        stateSetter(event.target.value);
    }

    function handleSavePref(event){
        event.preventDefault();
        Object.keys(stateMap).forEach(key => {
            deleteCookie(key);
            setCookie(key, stateMap[key].state);
        });
    }

    useEffect(() => {
        Object.keys(stateMap).forEach(key => {
            const cookieValue = getCookieValue(key);
            if(cookieValue !== undefined){
                const stateSetter = stateMap[key].setter;
                stateSetter(cookieValue);
            }
        });
    }, []);

    return(
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
    );
}

export default Preferences;