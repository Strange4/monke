import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import './App.css';

/**
 * Displays the Main App container
 * @returns {ReactElement}
 */
function App() {

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Router>
            <div id="popup-root" />
        </div>
    );
}

export default App;
