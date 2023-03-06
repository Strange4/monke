import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Pages/Home';
import AuthContext from './Context/AuthContext';
import { useState, useEffect } from 'react';
import checkAccess from './Controller/AuthHelper';
import Profile from './Pages/Profile';

const queryClient = new QueryClient();

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {
    const [userEmail, setUserEmail] = useState();
    const [token, setToken] = useState();

    useEffect(() => {
        (async () => {
            if (!userEmail) {
                let userData = await fetch("/authentication/refreshLogin")
                if (userData.status === 200) {
                    let newEmail = await userData.json()
                    setUserEmail(newEmail.email)
                }
            }
        })();
    }, [userEmail]);

    return (
        <div className="App">
            <AuthContext.Provider value={{
                token: token,
                setToken: setToken,
                userEmail: userEmail,
                setUserEmail: setUserEmail,
                checkAccess: checkAccess
            }}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
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
