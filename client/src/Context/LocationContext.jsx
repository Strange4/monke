import React from "react";

export const LocationContext = React.createContext(null);

export function LocationContextProvider({ children }) {
    const lastVisitedLocation = React.useRef(null);
    
    function registerLocation(location) {
        lastVisitedLocation.current = location;
    }
    return (
        <LocationContext.Provider value={{ registerLocation, lastVisitedLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

