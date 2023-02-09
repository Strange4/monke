import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import VirtualKeyboard from './Components/VirtualKeyboard';
import TextContainer from './Components/TextContainer';
import './App.css';
import { useState } from "react"

/**
 * 
 * @returns html
 */
function App() {

    const allShiftKeys =
        [
            ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"],
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\""],
            ["Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"],
            [" "]
        ]

    const allRegKeys =
        [
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
            ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
            [" "]
        ]

    const [keyboard, setKeyboard] = useState(allRegKeys)

    return (
        <div className="App">
            <TextContainer
                currentKeys={keyboard}
                allRegKeys={allRegKeys}
                allShiftKeys={allShiftKeys}
                setKeyboard={setKeyboard} />
            <VirtualKeyboard currentKeys={keyboard} />
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                </Routes>
            </Router>
            <div id="popup-root"/>
        </div>
    );
}

export default App;
