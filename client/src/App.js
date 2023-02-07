import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Lobby from './Pages/Lobby';
import Profile from './Pages/Profile';

/**
 * 
 * @returns html
 */
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/lobby" element={<Lobby/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Router>
      <div id="popup-root"/>
    </div>
  );
}

export default App;
