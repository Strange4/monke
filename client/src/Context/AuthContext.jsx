import React from 'react';

let AuthContext = React.createContext(
    {
        user: {},
        setUserData: ()=>{},
        checkAccess: ()=>{},
        setLoginStatus: ()=>{}
    }
);

export default AuthContext;