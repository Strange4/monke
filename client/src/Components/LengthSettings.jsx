import './Styles/Settings.css';

/**
 * Displays time specific settings
 * @returns {ReactElement}
 */
function LengthSettings() {

    async function getQuote(e){
        const url = `/api/quote?quoteLength=${e.target.textContent}`;
        const data = await fetch(url);
        const json = await data.json();
        const quote = json.body;
        console.log(quote);
    }

    async function getRandom(){
        const url = `/api/quote`;
        const data = await fetch(url);
        const json = await data.json();
        const quote = json.body;
        console.log(quote);
    }

    return (
        <div id="length-settings">
            <button type="button" onClick={getQuote}>short</button>
            <button type="button" onClick={getQuote}>medium</button>
            <button type="button" onClick={getQuote}>long</button>
            <button type="button" onClick={getRandom}>random</button>
        </div>
    );
}

export default LengthSettings;