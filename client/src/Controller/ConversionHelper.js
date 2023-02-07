
function cleanUpLetter(letter) {
  switch (letter) {
  case " ":
    return "_space"
  case "'":
    return "_apostrophe"
  case ";":
    return "_semiColon"
  case "[":
    return "_openSquare"
  case "]":
    return "_closeSquare"
  case ",":
    return "_comma"
  case ".":
    return "_period"
  case "/":
    return "_forwardSlash"
  case "\\":
    return "_backSlash"
  case "=":
    return "_equal"
  default:
    return `_${letter}`
  }
}

export {cleanUpLetter}