import React from 'react';

const AuthContext = React.createContext(
    {
        userEmail: {},
        setUserEmail: () => { },
        checkAccess: async () => { },
        userLoggedIn: false,
        setUserLoggedIn: () => {  }
    }
);

export default AuthContext;