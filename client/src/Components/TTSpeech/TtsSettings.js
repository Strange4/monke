import { getCookieValue } from "../../Controller/CookieHelper";

class TtsSettings {

    constructor(){
        const speed = getCookieValue("ttsSpeed");
        this.state = {
            "enableTTSQuote":  getCookieValue("enableTTSQuote") === "true" ? "true" : "false",
            "ttsSpeed": speed !== undefined ? speed : "1"
        }
    }

    updateSettings(enableTTS, speed){
        this.setValue("enableTTSQuote", enableTTS);
        this.setValue("ttsSpeed", speed);
    }

    setValue(name, value){
        this.state[name] = value;
    }

    getValue(name){
        return this.state[name];
    }
}

export default TtsSettings;