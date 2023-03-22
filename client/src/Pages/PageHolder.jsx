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
            location.pathname !== "/multiplayer-game" && 
            location.pathname !== "/endgame-results"
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile"
                element={
                    auth.userEmail ?
                        <Profile />
                        :
                        <Login navbar={true} />
                } />
            <Route path='/lobby' element={<Lobby />} />
            <Route path='/multiplayer-game' element={<MultiplayerGame />} />
            <Route path="/profile" element={
                auth.userEmail ?
                    <Profile redirect={auth.userEmail ? false : true} />
                    :
                    <></>
            } />
        </Routes>
    )
}

export default PageHolder