import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthContext from './Context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import PageHolder from './Pages/PageHolder';
import SocketContext from './Context/SocketContext';
import { LocationContextProvider } from './Context/LocationContext';

const queryClient = new QueryClient();

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const socket = useRef();
    
    useEffect(() => {
        (async () => {
            if(!userLoggedIn){
                const userData = await fetch("/authentication/checkLogin")
                if (userData.status === 200) {
                    setUserLoggedIn(true);
                }
            }
        })();
    }, [userLoggedIn]);

    return (
        <div className="App">
            <LocationContextProvider >
                <AuthContext.Provider value={{
                    userLoggedIn,
                    setUserLoggedIn
                }}>
                    <SocketContext.Provider value={{
                        socket: socket,
                        userList: []
                    }}>
                        <QueryClientProvider client={queryClient}>
                            <Router>
                                <PageHolder />
                            </Router>
                            <div id="popup-root" />
                        </QueryClientProvider>
                    </SocketContext.Provider>
                </AuthContext.Provider>
            </LocationContextProvider>
        </div >
    );
}

export default App;
