import { cleanUpLetter } from "../../Controller/ConversionHelper";
import VirtualKey from "./VirtualKey";

function VirtualKeyboard(props) {

    function getKeyType(key) {
        switch (key) {
        case " ":
            return "space";
        case "Shift":
            return "shift";
        default:
            return "";
        }
    }
    return (
        <div className="keyboard-container vertical">
            {props.currentKeys.map((row, i) => {
                return (
                    <div key={i} className="horizontal">
                        {row.map((key, i) =>
                            <VirtualKey
                                mapKeys={props.mapKeys}
                                key={i}
                                classValue={`${getKeyType(key)}`}
                                keyValue={key}
                                keyCode={cleanUpLetter(key)} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default VirtualKeyboard;
