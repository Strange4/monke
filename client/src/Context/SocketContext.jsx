import React from 'react';

const SocketContext = React.createContext(
    {
        socket: {},
        userList: []
    }
);

export default SocketContext;