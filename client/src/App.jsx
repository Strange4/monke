import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Home from './Pages/Home';
import Login from './Components/Login';
import AuthContext from './Context/AuthContext';
import { useState, useEffect } from 'react';
import checkAccess from './Controller/AuthHelper';
import Profile from './Pages/Profile';

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {
    const [loginStatus, setLoginStatus] = useState();
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

    useEffect(() => {
        localStorage.setItem('userEmail', userEmail);
    }, [userEmail]);

    useEffect(() => {
        console.log(loginStatus)
        setLoginStatus(checkAccess());
        if (localStorage.getItem('userEmail')) {
            setUserEmail(localStorage.getItem('userEmail'));
        }
    }, []);

    return (
        <div className="App">
            <AuthContext.Provider value={{
                userEmail: userEmail,
                setUserEmail: setUserEmail,
                checkAccess: checkAccess,
                setLoginStatus: setLoginStatus
            }}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home loginStatus={loginStatus} />} />
                        <Route path="/profile" element={
                            loginStatus === true ?
                                <Profile loginStatus={loginStatus} /> : <Login navbar={true} />
                        } />
                    </Routes>
                </Router>
                <div id="popup-root" />
            </AuthContext.Provider>
        </div >
    );
}

export default App;
