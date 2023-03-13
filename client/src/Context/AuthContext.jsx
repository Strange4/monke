import React from 'react';

const AuthContext = React.createContext(
    {
        userEmail: {},
        setUserEmail: () => { },
        checkAccess: async () => { },
        socket: {}
    }
);

export default AuthContext;