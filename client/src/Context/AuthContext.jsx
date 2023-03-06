import React from 'react';

const AuthContext = React.createContext(
    {
        userEmail: {},
        setUserEmail: () => { },
        checkAccess: async () => { },
    }
);

export default AuthContext;