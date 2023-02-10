import NavBar from "../Components/NavBar";
import VirtualKeyboard from '../Components/VirtualKeyboard';
import TextContainer from '../Components/TextContainer';
import { useState } from "react"

const Home = () => {

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
        <div id="home">
            <NavBar />
            <h1>Home Page</h1>
            <div id="game-component">
                <TextContainer
                    currentKeys={keyboard}
                    allRegKeys={allRegKeys}
                    allShiftKeys={allShiftKeys}
                    setKeyboard={setKeyboard} />
                <VirtualKeyboard currentKeys={keyboard} />
            </div>
        </div>
    )
}

export default Home;