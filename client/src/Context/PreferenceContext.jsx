import React from "react";

const PreferenceContext = React.createContext(
    {
        enableTTSQuote: {},
        setEnableTTSQuote: () => {},
        ttsSpeed: {},
        setTtsSpeed: () => {},
        ttsVoice: {},
        setTtsVoice: () => {}
    }
);

export default PreferenceContext;