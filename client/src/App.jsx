import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Pages/Home';
import AuthContext from './Context/AuthContext';
import { useState, useEffect } from 'react';
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

    return (
        <div className="App">
            <AuthContext.Provider value={{
                userEmail: userEmail,
                setUserEmail: setUserEmail,
                checkAccess: checkAccess
            }}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile"
                                element={
                                    userEmail ?
                                        <Profile />
                                        :
                                        <Login navbar={true} />
                                } />
                            <Route path='/lobby' element={<Lobby/>}/>
                            <Route path='/multiplayer-game' element={<MultiplayerGame/>}/>

                            <Route path="/profile" element={
                                userEmail ?
                                    <Profile redirect={userEmail ? false : true} />
                                    :
                                    <></>
                            } />
                        </Routes>
                    </Router>
                    <div id="popup-root" />
                </QueryClientProvider>
            </AuthContext.Provider>
        </div >
    );
}

export default App;
