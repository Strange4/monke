import './Styles/Popup.css';
import { useState } from 'react';


function Preferences(){

    const [enableTTSQuote, setEnableTTSQuote] = useState(false)
    const [tssSpeed, setTssSpeed] = useState(1);

    const stateMap = {
        "enableTTSQuote": setEnableTTSQuote,
        "tssSpeed": setTssSpeed
    }

    function handlePrefChange(event){
        const stateSetter = stateMap[event.target.name];
        stateSetter(event.target.value);
    }

    function handleSavePref(event){
        event.preventDefault();
        console.log(enableTTSQuote);
        console.log(tssSpeed);
    }

    return(
        <form onSubmit={handleSavePref}>
            <div className="popup">
                <h1>Accessibility</h1>
                <div id="TTSQuote-pref">
                    <p>Enable Text-To-Speech for quotes</p>
                    <input type={"radio"} id="TTSQuoteOn" name="enableTTSQuote" value={true}
                        onClick={handlePrefChange} />
                    <label htmlFor="TTSQuoteOn">Enable</label>
                    <input type={"radio"} id="TTSQuoteOff" name="enableTTSQuote" value={false}
                        defaultChecked onClick={handlePrefChange} />
                    <label htmlFor="TTSQuoteOff">Disable</label>

                    <p>Text-To-Speech speed</p>
                    <input type={"radio"} id="tssSpeedSlow" name="tssSpeed" value={0.7}
                        onClick={handlePrefChange} />
                    <label htmlFor="tssSpeedSlow">Slow</label>
                    <input type={"radio"} id="tssSpeedNorm" name="tssSpeed" value={1} defaultChecked
                        onClick={handlePrefChange} />
                    <label htmlFor="tssSpeedNorm">Normal</label>
                    <input type={"radio"} id="tssSpeedFast" name="tssSpeed" value={1.3}
                        onClick={handlePrefChange} />
                    <label htmlFor="tssSpeedFast">Fast</label>
                </div>
                <button type="submit">Save preferences</button>
            </div>
        </form>

    );
}

export default Preferences;