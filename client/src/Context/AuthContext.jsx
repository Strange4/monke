import React from 'react';

let AuthContext = React.createContext(
    {
        userEmail: {},
        setUserEmail: () => { },
        checkAccess: () => { },
        setLoginStatus: () => { }
    }
);

export default AuthContext;