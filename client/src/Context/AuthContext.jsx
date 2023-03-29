import React from 'react';

const AuthContext = React.createContext(
    {
        checkAccess: async () => { },
        userLoggedIn: false,
        setUserLoggedIn: () => {  }
    }
);

export default AuthContext;