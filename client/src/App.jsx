import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Pages/Home';
import Login from './Components/Login';
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

    useEffect(() => {
        console.log(loginStatus)
        setLoginStatus(checkAccess());
    }, []);

    useEffect(() => {
        (async () => {
            let userData = await fetch("/authentication/refreshLogin")
            setUserEmail(userData.email)
            console.log(userEmail)
        })()
    }, [userEmail])

    return (
        <div className="App">
            <AuthContext.Provider value={{
                userEmail: userEmail,
                setUserEmail: setUserEmail,
                checkAccess: checkAccess,
                setLoginStatus: setLoginStatus
            }}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home loginStatus={loginStatus} />} />
                            <Route path="/profile"
                                element={
                                    loginStatus === true ?
                                        <Profile loginStatus={loginStatus} />
                                        :
                                        <Login navbar={true} />
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
