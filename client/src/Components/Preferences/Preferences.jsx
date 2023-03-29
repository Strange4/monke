import '../Styles/Popup.css';
import { useState, useEffect, useRef } from 'react';
import {setCookie, getCookieValue, deleteCookie} from '../../Controller/CookieClass'
import Popup from 'reactjs-popup';
import EnableTTS from './EnableTTS';
import TssSpeed from './TssSpeed';

function Preferences({open, toggleShow, setEnableTTS}){

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
        enableTTSQuote === "true" ? setEnableTTS("true") : setEnableTTS("false");
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
                        <EnableTTS enabled={enableTTSQuote} changeOption={handlePrefChange} />
                        <TssSpeed speed={tssSpeed} changeOption={handlePrefChange} />
                    </div>
                    <button type="submit">Save preferences</button>
                </div>
            </form>
        </Popup>
    );
}

export default Preferences;