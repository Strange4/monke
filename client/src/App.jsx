import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthContext from './Context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import PageHolder from './Pages/PageHolder';
import checkAccess from './Controller/AuthHelper';

const queryClient = new QueryClient();

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {
    const [userEmail, setUserEmail] = useState();
    const socket = useRef();

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
                checkAccess: checkAccess,
                socket: socket,
            }}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <PageHolder />
                    </Router>
                    <div id="popup-root" />
                </QueryClientProvider>
            </AuthContext.Provider>
        </div >
    );
}

export default App;
