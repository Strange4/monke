import React from 'react';

let AuthContext = React.createContext(
    {
        userEmail: {},
        setUserEmail: () => { },
        checkAccess: () => { },
    }
);

export default AuthContext;