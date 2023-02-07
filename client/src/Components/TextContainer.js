import "./TextContainer.css"
import { cleanUpLetter } from "../Controller/ConversionHelper"

function TextContainer(props) {
  function handleOnChange(e) {
    let letter = e.nativeEvent.data
    if (props.allKeys.some(row => row.includes(letter))) {
      letter = cleanUpLetter(letter)

      let currentKey = document.querySelector(`#${letter}`)
      currentKey.classList.add("pressed")
      setTimeout(() => {
        currentKey.classList.remove("pressed")
      }, 100)
    }
    else {
      console.log("not here => " + letter)
    }
  }

  return (
    <textarea className="text-container" onChange={e => handleOnChange(e)}>

    </textarea>
  )
}

export default TextContainer