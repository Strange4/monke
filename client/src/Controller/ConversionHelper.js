/**
 * Helper function to convert special 
 * characters into their string name definition
 * @param {string} letter 
 * @returns string
 */
function cleanUpLetter(letter) {
    switch (letter) {
    case " ":
        return "_space";
    case "'":
        return "_apostrophe";
    case ";":
        return "_semiColon";
    case "[":
        return "_openSquare";
    case "]":
        return "_closeSquare";
    case ",":
        return "_comma";
    case ".":
        return "_period";
    case "/":
        return "_forwardSlash";
    case "\\":
        return "_backSlash";
    case "=":
        return "_equal";
    case "!":
        return "_exclamation";
    case "@":
        return "_at";
    case "#":
        return "_hashtag";
    case "$":
        return "_dollar";
    case "%":
        return "percent";
    case "^":
        return "_caret";
    case "&":
        return "_and";
    case "*":
        return "_star";
    case "(":
        return "_openParenthese";
    case ")":
        return "_closeParenthese";
    case "\"":
        return "_double_quote";
    case ":":
        return "_semi-colon";
    case "+":
        return "_plus";
    case "{":
        return "_openCurly";
    case "}":
        return "_closeCurly";
    case "|":
        return "_pipe";
    case "?":
        return "_question";
    case ">":
        return "_gt";
    case "<":
        return "_lt";
    default:
        return `_${letter}`;
    }
}

export { cleanUpLetter };