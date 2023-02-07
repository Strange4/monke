import VirtualKeyboard from './Components/VirtualKeyboard';
import TextContainer from './Components/TextContainer';
import './App.css';

function App() {
  const allKeys =
  [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    [" "]
  ]

  return (
    <div className="App">
      <TextContainer allKeys={allKeys}/>
      <VirtualKeyboard allKeys={allKeys}/>
    </div>
  );
}

export default App;
