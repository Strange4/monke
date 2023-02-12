import "./styles/TypingGame.css"
import GameText from './GameText';
import TypingScreen from './TypingScreen/TypingScreen';
export default function TypingGame(props){
    const textToDisplay = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic harum repellendus eveniet minima at reprehenderit, qui cum fugiat, velit vitae dolore quidem. Maiores ab ratione commodi, nobis harum voluptates minima?";
    return (
        <div className="vertical-center">
            <GameText textToDisplay={textToDisplay}/>
            <TypingScreen/>
        </div>
    );
}