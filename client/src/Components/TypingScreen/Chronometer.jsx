import "./Layout/Chronometer.css";

function Chronometer(props) {

  return (
    <div id="chronometer">
      <p><span id="seconds">{props.seconds}</span></p>
    </div>
  );
}

export default Chronometer;
