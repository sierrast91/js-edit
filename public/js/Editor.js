var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Editor_instances, _Editor_bufInit, _Editor_resize, _Editor_setFont, _Editor_keyup, _Editor_keydown, _Editor_insertH, _Editor_normalH, _Editor_resetState, _Editor_updateState, _Editor_addEventListeners;
import Buffer from "./Buffer.js";
import vim from "./VIM.js";
import utils from "./Utils.js";
class Editor {
    constructor(ctx) {
        _Editor_instances.add(this);
        //vimspesific
        this.mode = "normal";
        this.state = {
            seq: [],
            count1: 1,
            count2: 1,
            command: "",
            motion: "",
        };
        //general editor
        this.ctx = ctx;
        this.bufs = [];
        this.cbuf = -1;
        this.charWidth = 0;
        this.charHeight = 0;
        this.rows = 0;
        this.cols = 0;
        __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_bufInit).call(this);
        __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_setFont).call(this);
        __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resize).call(this);
        __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_addEventListeners).call(this);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.bufs[this.cbuf].draw(this.ctx, this.rows, this.cols, this.charWidth, this.charHeight);
        this.ctx.fillStyle = "darkblue";
        this.ctx.fillText(this.mode, this.charWidth, this.charHeight * (this.rows - 1));
    }
}
_Editor_instances = new WeakSet(), _Editor_bufInit = function _Editor_bufInit() {
    this.bufs.push(new Buffer("", ["Hello World!", "Second line ..."]));
    this.cbuf += 1;
}, _Editor_resize = function _Editor_resize() {
    this.rows = Math.floor(this.ctx.canvas.height / this.charHeight);
    this.cols = Math.floor(this.ctx.canvas.width / this.charWidth);
}, _Editor_setFont = function _Editor_setFont() {
    this.ctx.font = "16px monospace";
    this.charWidth = 10;
    this.charHeight = 22;
}, _Editor_keyup = function _Editor_keyup(_e) {
}, _Editor_keydown = function _Editor_keydown(e) {
    e.preventDefault();
    // handling logic
    {
        __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_updateState).call(this, e.key);
        if (this.mode == "normal") {
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_normalH).call(this, e);
        }
        else if (this.mode == "insert") {
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_insertH).call(this, e);
        }
    }
    // update changes
    this.draw();
}, _Editor_insertH = function _Editor_insertH(e) { }, _Editor_normalH = function _Editor_normalH(e) {
    let arrlen = this.state.seq.length;
    if (arrlen === 1) {
        if (this.state.seq[0] === "h") {
            vim.left(1, this.bufs[this.cbuf]);
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resetState).call(this);
        }
        else if (this.state.seq[0] === "j") {
            vim.down(1, this.bufs[this.cbuf]);
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resetState).call(this);
        }
        else if (this.state.seq[0] === "k") {
            vim.up(1, this.bufs[this.cbuf]);
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resetState).call(this);
        }
        else if (this.state.seq[0] === "l") {
            vim.right(1, this.bufs[this.cbuf]);
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resetState).call(this);
        }
        else if (this.state.seq[0] === "w") {
            vim.word(1, this.bufs[this.cbuf]);
            __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resetState).call(this);
        }
        else {
            console.log("key pressed", e.key);
        }
    }
    else if (arrlen >= 2) {
        console.log("key pressed", this.state.seq);
    }
}, _Editor_resetState = function _Editor_resetState() {
    this.state.seq = [];
    this.state.command = "";
    this.state.motion = "";
    this.state.count1 = 0;
    this.state.count2 = 0;
}, _Editor_updateState = function _Editor_updateState(key) {
    if (utils.isSpecial(key)) {
        switch (key) {
            case "Shift":
            case "Alt":
            case "AltGraph":
            case "Control":
                break;
            case "Escape":
                __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_resetState).call(this);
                break;
            case "PageUp":
            case "PageDown":
            case "Home":
            case "End":
            case "Enter":
            case "Backspace":
            case "Delete":
                this.state.seq.push(key);
                break;
            default:
                console.log("unhandled special key:", key);
        }
    }
    else {
        this.state.seq.push(key);
    }
}, _Editor_addEventListeners = function _Editor_addEventListeners() {
    document.addEventListener("keyup", (e) => __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_keyup).call(this, e));
    document.addEventListener("keydown", (e) => __classPrivateFieldGet(this, _Editor_instances, "m", _Editor_keydown).call(this, e));
};
export default Editor;
// function getTimes(s: string) {
//   let val = parseInt(s, 10)
//   if (isNaN(val)) {
//     console.log("nan found")
//     val = 1
//   }
//   return val
// }
