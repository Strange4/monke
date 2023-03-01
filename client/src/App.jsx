import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './styles/App.css'
import Home from './Pages/Home';
import Profile from './Pages/Profile';


const queryClient = new QueryClient();
/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {
    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" 
                            element={<Profile profilePicture={""} 
                            />} />
                    </Routes>
                </Router>
                <div id="popup-root" />
            </QueryClientProvider>
        </div>
    );
}

export default App;
