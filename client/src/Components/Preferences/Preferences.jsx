import '../Styles/Popup.css';
import '../Styles/Preferences.css';
import { useState, useEffect, useRef, useContext } from 'react';
import {setCookie, getCookieValue, deleteCookie} from '../../Controller/CookieHelper';
import Popup from 'reactjs-popup';
import EnableTTS from './EnableTTS';
import TtsSpeed from './TtsSpeed';
import PreferenceContext from '../../Context/PreferenceContext';
import TtsVoice from './TtsVoice';

function Preferences({open, toggleShow}){

    const preferenceContext = useContext(PreferenceContext)
    /**
     * Define states for all preferences and their default values
     */
    const [tempEnableTTSQuote, setEnableTTSQuote] = useState(preferenceContext.enableTTSQuote)
    const [tempTtsSpeed, setTtsSpeed] = useState(preferenceContext.ttsSpeed);
    const [tempTtsVoice, setTtsVoice] = useState(undefined);
    const popupRef = useRef(null);

    /**
     * Used to facilitate handling changing preferences,
     * saving/loading all preferences by looping through all entries
     */
    const stateMap = {
        "enableTTSQuote": {
            state: tempEnableTTSQuote,
            setter: setEnableTTSQuote
        },
        "ttsSpeed": {
            state: tempTtsSpeed,
            setter: setTtsSpeed
        },
        "ttsVoice": {
            state: tempTtsVoice,
            setter: setTtsVoice
        }
    }

    /**
     * Will handle changing the temporary state of preference value.
     * The target's name value will be retrieved and used to reference the
     * appropriate state setting function in the stateMap object.
     * @param {*} event
     */
    function handlePrefChange(event){
        const stateSetter = stateMap[event.target.name].setter;
        stateSetter(event.target.value);
    }

    /**
     * Save states of all values to cookie and applies changes to
     * preference context
     * @param {*} event 
     */
    function handleSavePref(event){
        event.preventDefault();
        Object.keys(stateMap).forEach(key => {
            deleteCookie(key);
            setCookie(key, stateMap[key].state);
        });
        tempEnableTTSQuote === "true" ?
            preferenceContext.setEnableTTSQuote("true") :
            preferenceContext.setEnableTTSQuote("false");
        preferenceContext.setTtsSpeed(tempTtsSpeed);
        preferenceContext.setTtsVoice(tempTtsVoice);
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
            <form id='preferences' onSubmit={handleSavePref}>
                <div className="popup" id='pref-popup'>
                    <h1>Accessibility</h1>
                    <div id="TTSQuote-pref">
                        <EnableTTS enabled={tempEnableTTSQuote} changeOption={handlePrefChange} />
                        <TtsSpeed speed={tempTtsSpeed} changeOption={handlePrefChange} />
                        <TtsVoice selected={tempTtsVoice} changeOption={handlePrefChange} />
                    </div>
                    <button type="submit" id='save-pref-btn'>Save preferences</button>
                </div>
            </form>
        </Popup>
    );
}

export default Preferences;