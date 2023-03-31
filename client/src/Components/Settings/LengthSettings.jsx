import '../Styles/Settings.css';
import {setCookie} from "../../Controller/CookieHelper";

/**
 * Let's the user choose between quote length preference.
 * When chosen, sets the cookie preference for quote length.
 * @returns {ReactElement}
 */
function LengthSettings(props) {

    /**
     * Sets the cookie preference of quote length when pressed.
     * @param {button} e, the button that is being pressed.
     */
    function setQuoteLength(e){
        const length = e.target.textContent;
        setCookie("quoteLength", length);
        props.setLength(length); 
    }
    const cookieSetting = props.quoteLength;

    return (
        <div id="length-settings">
            <button className={cookieSetting === "short" ? "highlightSetting" : ""}  
                onClick={setQuoteLength}>short</button>
            <button className={cookieSetting === "medium" ? "highlightSetting" : ""} 
                onClick={setQuoteLength}>medium</button>
            <button className={cookieSetting === "long" ? "highlightSetting" : ""} 
                onClick={setQuoteLength}>long</button>
            <button className={cookieSetting === "random" ? "highlightSetting" : ""}  
                onClick={setQuoteLength}>random</button>
        </div>
    );
}

export default LengthSettings;