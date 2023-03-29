import './Styles/Settings.css';
import {setCookie} from "../Controller/CookieHelper";

/**
 * Let's the user choose between quote length preference.
 * When chosen, sets the cookie preference for quote length.
 * @returns {ReactElement}
 */
function LengthSettings() {

    /**
     * Get a quote from the API depending on the chosen length.
     * Sets the cookie preference of quote length when pressed.
     * @param {button} e, the button that is being pressed.
     */
    async function getQuote(e){
        let url;
        if (e.target.textContent === "random"){
            url = "/api/quote";
        } else{
            url = `/api/quote?quoteLength=${e.target.textContent}`;
        }
        const data = await fetch(url, {
            headers: { 'Accept': 'application/json', "Content-Type": "application/json" }
        });
        if (!data.ok){
            throw new Error("The fetch request failed");
        } else{
            const json = await data.json();
            const quote = json.body;
            console.log(quote);
            setCookie("quoteLength", e.target.textContent);
        }  
    }

    return (
        <div id="length-settings">
            <button type="button" onClick={getQuote}>short</button>
            <button type="button" onClick={getQuote}>medium</button>
            <button type="button" onClick={getQuote}>long</button>
            <button type="button" onClick={getQuote}>random</button>
        </div>
    );
}

export default LengthSettings;