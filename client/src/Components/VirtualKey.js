import "./VirtualKey.css"

function VirtualKey(props) {
    return (
        <div className={`keyboard-key ${props.classValue}`} id={props.keyCode}> {props.keyValue} </div>
    );
}

export default VirtualKey;
