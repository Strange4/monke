import { useContext, useEffect } from 'react';
import Profile from './Profile';
import Lobby from './Lobby';
import MultiplayerGame from './MultiplayerGame';
import Login from '../Components/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import AuthContext from '../Context/AuthContext';
import { LocationContext } from '../Context/LocationContext';

function PageHolder() {
    const auth = useContext(AuthContext);
    const locationContext = useContext(LocationContext)
    const currentLocation = useLocation();
    const ROUTES = ["/", "/profile", "/lobby", "/multiplayer-game"];

    if (locationContext.lastVisitedLocation.current === null || !ROUTES.includes(currentLocation.pathname)) {
        locationContext.validAccess = false;
    } else {
        locationContext.lastVisitedLocation.current = currentLocation.pathname
        locationContext.validAccess = true;
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
            <Route path="*" element={<Home />} />
        </Routes>
    );
}

export default PageHolder;