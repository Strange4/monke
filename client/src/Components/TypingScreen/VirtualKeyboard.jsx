import VirtualKey from "./VirtualKey";

/**
 * 
 * @param {{currentKeys: {letter: string; isPressed: boolean; }[][]}} param
 * @returns 
 */
function VirtualKeyboard({currentKeys}) {
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
            {currentKeys.map((row, i) => {
                return (
                    <div key={i} className="horizontal">
                        {row.map((key, i) =>
                            <VirtualKey
                                key={i}
                                isPressed={key.isPressed}
                                keyValue={key.keyValue}
                                classValue={`${getKeyType(key.keyValue)}`}/>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default VirtualKeyboard;
