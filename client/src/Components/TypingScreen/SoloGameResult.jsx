import './Layout/SoloGameResult.css';

function SoloGameResult(props) {
  return (
    <div id="solo-game-result">
      <h1>END Solo Game Popup</h1>
      <p>time: {props.time} seconds </p>
      <p>wpm: {props.wpm}</p>
    </div>
  );
}

export default SoloGameResult;