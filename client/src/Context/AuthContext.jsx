import React from 'react';

const AuthContext = React.createContext(
    {
        token: "",
        setToken: () => { },
        userEmail: {},
        setUserEmail: () => { },
        checkAccess: async () => { },
    }
);

export default AuthContext;