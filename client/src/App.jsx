import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Pages/Home';
import AuthContext from './Context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PageHolder from './Pages/PageHolder';
import checkAccess from './Controller/AuthHelper';
import Profile from './Pages/Profile';
import Lobby from './Pages/Lobby';
import MultiplayerGame from './Pages/MultiplayerGame';
import Login from './Components/Login';

const queryClient = new QueryClient();

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {
    const [userEmail, setUserEmail] = useState();
    const socket = useRef();
    // const location = useLocation()

    useEffect(() => {
        (async () => {
            if (!userEmail) {
                const userData = await fetch("/authentication/refreshLogin")
                if (userData.status === 200) {
                    const newEmail = await userData.json()
                    setUserEmail(newEmail.email)
                }
            }
        })();
    }, [userEmail]);

    // useEffect(() => {
    //     console.log("here")
    //     console.log(location.pathname)
    //     if(location.pathname !== "/lobby") {
    //         auth.socket.current.disconnect()
    //         auth.socket.current = undefined
    //     }
    // }, [location]);

    return (
        <div className="App">
            <AuthContext.Provider value={{
                userEmail: userEmail,
                setUserEmail: setUserEmail,
                checkAccess: checkAccess,
                socket: socket,
            }}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                       <PageHolder/>
                    </Router>
                    <div id="popup-root" />
                </QueryClientProvider>
            </AuthContext.Provider>
        </div >
    );
}

export default App;
