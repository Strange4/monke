import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Profile from './Profile';
import Lobby from './Lobby';
import MultiplayerGame from './MultiplayerGame';
import Login from '../Components/Login';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AuthContext from '../Context/AuthContext';

function PageHolder() {
    const auth = useContext(AuthContext);
    const location = useLocation()

    useEffect(() => {
        if (location.pathname !== "/lobby" && auth.socket.current) {
            auth.socket.current.disconnect()
            auth.socket.current = undefined
        }
    }, [location]);

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