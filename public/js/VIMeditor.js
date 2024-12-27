var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _VIMeditor_instances, _VIMeditor_updateCx;
class VIMeditor {
    constructor() {
        _VIMeditor_instances.add(this);
        this.mode = "normal";
        this.seq = "";
    }
    mousedown(x, y, buf) {
        buf.cx = x;
        buf.cy = y;
    }
    keyup(e, buf) {
        console.log(e.key, buf.cx, buf.cy);
    }
    keydown(e, buf) {
        if (this.mode == "normal") {
            if (e.key == "Escape") {
                this.seq = "";
                return;
            }
            else if (e.key == "a") {
                this.mode = "insert";
                return;
            }
            else if (e.key == "i") {
                this.mode = "insert";
                return;
            }
            else if (e.key == "h") {
                let times = getTimes(this.seq);
                this.Left(times, buf);
                this.seq = "";
            }
            else if (e.key == "j") {
                let times = getTimes(this.seq);
                this.Down(times, buf);
                this.seq = "";
            }
            else if (e.key == "k") {
                let times = getTimes(this.seq);
                this.Up(times, buf);
                this.seq = "";
            }
            else if (e.key == "l") {
                let times = getTimes(this.seq);
                this.Right(times, buf);
                this.seq = "";
            }
            else if (e.key == "End") {
                this.End(buf);
            }
            else if (e.key == "Home") {
                this.Home(buf);
            }
        }
        else if (this.mode == "insert") {
            if (e.key == "Escape") {
                this.mode = "normal";
            }
            else if (e.key == "Backspace") {
                this.Delete(1, buf);
            }
            else {
                this.Insert(e.key, buf);
                return;
            }
        }
        else {
            console.log("e.key:", e.key);
        }
    }
    Left(times, buf) {
        buf.cx = buf.cx - times;
        if (buf.cx < 0)
            buf.cx = 0;
        buf.cxr = buf.cx;
    }
    Right(times, buf) {
        buf.cx = buf.cx + times;
        if (buf.cx >= buf.lines[buf.cy].length) {
            buf.cx = buf.lines[buf.cy].length - 1;
            buf.cxr = Number.MAX_SAFE_INTEGER;
        }
        else {
            buf.cxr = buf.cx;
        }
    }
    Up(times, buf) {
        buf.cy = buf.cy - times;
        if (buf.cy < 0) {
            buf.cy = 0;
        }
        __classPrivateFieldGet(this, _VIMeditor_instances, "m", _VIMeditor_updateCx).call(this, buf);
    }
    Down(times, buf) {
        buf.cy = buf.cy + times;
        if (buf.cy >= buf.lines.length) {
            buf.cy = buf.lines.length - 1;
        }
        __classPrivateFieldGet(this, _VIMeditor_instances, "m", _VIMeditor_updateCx).call(this, buf);
    }
    Home(buf) {
        buf.cxr = 0;
        buf.cx = 0;
    }
    End(buf) {
        buf.cxr = Number.MAX_SAFE_INTEGER;
        buf.cx = buf.lines[buf.cy].length - 1;
    }
    Insert(word, buf) {
        let first = buf.lines[buf.cy].slice(0, buf.cx);
        let second = buf.lines[buf.cy].slice(buf.cx);
        buf.lines[buf.cy] = first + word + second;
        buf.cx = buf.cx + word.length;
    }
    Delete(wlen, buf) {
        let cx_new = buf.cx - wlen;
        if (cx_new < 0) {
            cx_new = 0;
        }
        let first = buf.lines[buf.cy].slice(0, cx_new);
        let second = buf.lines[buf.cy].slice(buf.cx);
        buf.lines[buf.cy] = first + second;
        buf.cx = cx_new;
    }
}
_VIMeditor_instances = new WeakSet(), _VIMeditor_updateCx = function _VIMeditor_updateCx(buf) {
    if (buf.cxr >= buf.lines[buf.cy].length) {
        buf.cx = buf.lines[buf.cy].length - 1;
    }
    else {
        buf.cx = buf.cxr;
    }
};
export default VIMeditor;
function getTimes(s) {
    let val = parseInt(s, 10);
    if (isNaN(val)) {
        console.log("nan found");
        val = 1;
    }
    return val;
}
