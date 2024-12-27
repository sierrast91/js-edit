import Buffer from "./Buffer.js"
import utils from "./Utils.js"
// vim functionalities here

function left(times: number, buf: Buffer) {
  //find new cx
  buf.cx = buf.cx - times
  if (buf.cx < 0)
    buf.cx = 0
  //updatet cxr
  buf.cxr = buf.cx
}
function backspace(times: number, buf: Buffer) {
  //find new cx and cy
  buf.cx = buf.cx - times
  let temp = buf.cy

  while (buf.cx < 0 && temp > 0) {
    temp--;
    buf.cx += buf.lines[temp].length
  }
  if (buf.cx < 0) {
    buf.cx = 0
  }
  buf.cy = temp

  // update cxr
  if (buf.cx == buf.lines[buf.cy].length - 1) {
    buf.cxr = Number.MIN_SAFE_INTEGER
  } else {
    buf.cxr = buf.cx
  }
}

function right(times: number, buf: Buffer) {
  //find new cx and update cxr
  buf.cx = buf.cx + times
  if (buf.cx >= buf.lines[buf.cy].length) {
    buf.cx = buf.lines[buf.cy].length - 1
  }
  buf.cxr = buf.cx
}

function up(times: number, buf: Buffer) {
  // update cy
  buf.cy = buf.cy - times
  if (buf.cy < 0) {
    buf.cy = 0
  }
  // move cx
  cyMovesCx(buf)
}

function down(times: number, buf: Buffer) {
  //update cy
  buf.cy = buf.cy + times
  if (buf.cy >= buf.lines.length) {
    buf.cy = buf.lines.length - 1
  }
  cyMovesCx(buf)
}

function home(buf: Buffer) {
  buf.cxr = 0
  buf.cx = 0
}

function end(buf: Buffer) {
  buf.cxr = Number.MAX_SAFE_INTEGER
  buf.cx = buf.lines[buf.cy].length - 1
}
// first and till
function first(ch: string, num: number, buf: Buffer, till: boolean = false) {
  let temp = buf.cx + 1
  let count = 0;
  let found = false;
  while (temp < buf.lines[buf.cy].length) {
    if (buf.lines[buf.cy].charAt(temp) == ch) {
      count++;
      if (count == num) {
        found = true
        break;
      }
    }
  }
  if (found) {
    buf.cx = till ? temp - 1 : temp
    buf.cxr = buf.cx
  }
}
//word
function word(count: number, buf: Buffer) {
  let tcx = buf.cx;
  let tcy = buf.cy;
  let cnt = 0;

  let ch = buf.lines[tcy].charAt(tcx);
  if (utils.isPunct(ch)) {
    cnt++;
  }
  //increment
  tcx++;
  if (tcx >= buf.lines[tcy].length) {
    if (tcy < buf.lines.length - 1) {
      tcy++;
      tcx = 0;
    } else {
      tcx = buf.lines[tcy].length - 1
      break;
    }
  }
  while (true) {
    ch = buf.lines[tcy].charAt(tcx);
    if (utils.isSpace(ch) || (utils.isPunct(ch)) {
      cnt++;
    }
  }
  buf.cx = tcx;
  buf.cy = tcy;
}
// insert related
function insert(word: string, buf: Buffer) {
  let first = buf.lines[buf.cy].slice(0, buf.cx)
  let second = buf.lines[buf.cy].slice(buf.cx)
  buf.lines[buf.cy] = first + word + second;
  buf.cx = buf.cx + word.length
}

function delInsert(wlen: number, buf: Buffer) {
  let cx_new = buf.cx - wlen
  if (cx_new < 0) {
    cx_new = 0
  }
  let first = buf.lines[buf.cy].slice(0, cx_new)
  let second = buf.lines[buf.cy].slice(buf.cx)
  buf.lines[buf.cy] = first + second
  buf.cx = cx_new
}

// private functions
function cyMovesCx(buf: Buffer) {
  if (buf.cxr >= buf.lines[buf.cy].length) {
    buf.cx = buf.lines[buf.cy].length - 1
  } else {
    buf.cx = buf.cxr
  }
}
export default {
  //move
  left, right, up, down,
  home, end, backspace,
  first, word,

  //insert
  insert, delInsert,
}
