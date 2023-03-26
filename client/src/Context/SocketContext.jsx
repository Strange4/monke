import React from 'react';

const SocketContext = React.createContext(
    {
        socket: {},
        userList: [],
        setUserList: () => { }
    }
);

export default SocketContext;