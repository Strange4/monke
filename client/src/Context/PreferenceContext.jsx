import React from "react";

const PreferenceContext = React.createContext(
    {
        enableTTSQuote: {},
        setEnableTTSQuote: () => {},
        ttsSpeed: {},
        setTtsSpeed: () => {}
    }
);

export default PreferenceContext;