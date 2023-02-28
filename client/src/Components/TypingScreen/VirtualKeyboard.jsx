import './Layout/VirtualKey.css'
/**
 * 
 * @param {{currentKeys: {keyValue: string; isPressed: boolean; }[][]}} param
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
                            <div key={i}
                                className={
                                    `keyboard-key
                                    ${getKeyType(key.keyValue)}
                                    ${key.isPressed ? "pressed" : undefined}`
                                }
                            >
                                {key.keyValue}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default VirtualKeyboard;
