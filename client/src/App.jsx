import logo from './logo.svg';
import './styles/App.css'
import GameText from './components/GameText';

function App() {
    return (
        <div className="App">
            <GameText textToDisplay="nice to meet you my friend how's it going?"/>
        </div>
    );
}

export default App;
