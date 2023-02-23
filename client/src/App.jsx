import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import Home from './Pages/Home';
import Login from './Components/Login';
import AuthContext from './Context/AuthContext';
import { useState, useEffect } from 'react';
import checkAccess from './Controller/AuthHelper'

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {

    const [loginStatus, setLoginStatus] = useState()
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        picture: "",
    })

    useEffect(() => {
        setLoginStatus(checkAccess())
    }, [])


    return (
        <div className="App">
            <AuthContext.Provider value={{
                user: userData,
                setUserData: setUserData,
                checkAccess: checkAccess,
                setLoginStatus: setLoginStatus
            }}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home loginStatus={loginStatus} />} />
                        <Route path="/profile" element={
                            <Login profilePicture={""} loginStatus={loginStatus} />
                        } />
                    </Routes>
                </Router>
                <div id="popup-root" />
            </AuthContext.Provider>
        </div >
    );
}

export default App;
