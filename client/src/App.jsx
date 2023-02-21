import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Login from './Components/Login';

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
                    <Route path="/profile" element={<Login profilePicture={""}/>} />
                </Routes>
            </Router>
            <div id="popup-root" />
        </div>
    );
}

export default App;
