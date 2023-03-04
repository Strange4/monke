/**
 * Helper function to convert special 
 * characters into their string name definition
 * @param {string} letter 
 * @s string
 */
function cleanUpLetter(letter) {
    return {
        " ": "_space",
        "'": "_apostrophe",
        ";": "_semiColon",
        "[": "_openSquare",
        "]": "_closeSquare",
        ",": "_comma",
        ".": "_period",
        "/": "_forwardSlash",
        "\\": "_backSlash",
        "=": "_equal",
        "!": "_exclamation",
        "@": "_at",
        "#": "_hashtag",
        "$": "_dollar",
        "%": "percent",
        "^": "_caret",
        "&": "_and",
        "*": "_star",
        "(": "_openParenthese",
        ")": "_closeParenthese",
        "\"": "_double_quote",
        ":": "_semi-colon",
        "+": "_plus",
        "{": "_openCurly",
        "}": "_closeCurly",
        "|": "_pipe",
        "?": "_question",
        ">": "_gt",
        "<": "_lt",
    }[letter] || `_${letter}`
}

export { cleanUpLetter };