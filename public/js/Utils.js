function isSpecial(ch) {
    return ch.length > 1;
}
function isDigit(ch) {
    let num = parseInt(ch, 10);
    return !isNaN(num);
}
function isSpace(ch) {
    return ch == " " || ch == "\t";
}
function isPunct(ch) {
    let word = "!\"_*+-/%&'#$(),.:;<=>?@[\\]^`{|}~";
    for (let i = 0; i < word.length; i++) {
        if (ch === word.charAt(i)) {
            return true;
        }
    }
    return false;
}
export default { isSpecial, isDigit, isSpace, isPunct };
