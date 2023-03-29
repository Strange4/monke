import { getCookieValue } from "../../Controller/CookieHelper";

class TtsSettings {

    constructor(){
        const speed = getCookieValue("ttsSpeed");
        this.state = {
            "enableTTSQuote":  getCookieValue("enableTTSQuote") === "true" ? "true" : "false",
            "ttsSpeed": speed !== undefined ? speed : "1"
        }
    }

    setValue(name, value){
        this.state[name] = value;
    }

    getValue(name){
        return this.state[name];
    }
}

export default TtsSettings;