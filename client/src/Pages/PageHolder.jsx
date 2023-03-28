import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from './Profile';
import Lobby from './Lobby';
import MultiplayerGame from './MultiplayerGame';
import Login from '../Components/Login';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AuthContext from '../Context/AuthContext';
import SocketContext from '../Context/SocketContext';

function PageHolder() {
    const auth = useContext(AuthContext);
    const socketContext = useContext(SocketContext)
    const location = useLocation()

    useEffect(() => {
        if (checkPathLocation() && socketContext.socket.current) {
            socketContext.socket.current.disconnect()
            socketContext.socket.current = undefined
        }
    }, [location.pathname]);

    function checkPathLocation() {
        return location.pathname !== "/lobby" &&
            location.pathname !== "/multiplayer-game"
    }

    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/profile"
                element={
                    auth.userEmail ?
                        <Profile />
                        :
                        <Login navbar={true} />
                } />
            <Route exact path='/lobby' element={<Lobby />} />
            <Route exact path='/multiplayer-game' element={<MultiplayerGame />} />
            <Route exact path="/profile" element={
                auth.userEmail ?
                    <Profile redirect={auth.userEmail ? false : true} />
                    :
                    <></>
            } />
        </Routes>
    );
}

export default PageHolder;