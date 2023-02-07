import "./TextContainer.css"
import { cleanUpLetter } from "../Controller/ConversionHelper"

function TextContainer(props) {
  function handleOnChange(e) {
    let letter = e.nativeEvent.key
    console.log(e.nativeEvent.key)
    if(letter === "Shift") {
      onShiftPressed()
    }
    if (props.currentKeys.some(row => row.includes(letter))) {
      letter = cleanUpLetter(letter)

      let currentKey = document.querySelector(`#${letter}`)
      currentKey.classList.add("pressed")

      setTimeout(() => {
        currentKey.classList.remove("pressed")
      }, 100)
    } else {
      console.log("not here => " + letter)
    }
  }

  function handleShiftRelease() {
    props.setKeyboard(props.allRegKeys)
  }

  function onShiftPressed() {
    console.log("shift is pressed")
    props.setKeyboard(props.allShiftKeys)
  }

  return (
    <textarea 
      className="text-container" 
      onKeyUp={e => handleShiftRelease(e)} 
      onKeyDown={e => handleOnChange(e)}>

    </textarea>
  )
}

export default TextContainer