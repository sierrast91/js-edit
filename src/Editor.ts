import Buffer from "./Buffer.js"
import vim from "./VIM.js"
import utils from "./Utils.js"

export default class Editor {
  //editor independent
  public ctx: CanvasRenderingContext2D;
  public bufs: Buffer[];
  public cbuf: number
  public charWidth: number
  public charHeight: number
  public cols: number
  public rows: number
  public mode: string
  public state: {
    seq: string[]
    count1: number
    command: string
    count2: number
    motion: string
  }
  constructor(ctx: CanvasRenderingContext2D) {
    //vimspesific
    this.mode = "normal"
    this.state = {
      seq: [],
      count1: 1,
      count2: 1,
      command: "",
      motion: "",
    }
    //general editor
    this.ctx = ctx
    this.bufs = []
    this.cbuf = -1
    this.charWidth = 0;
    this.charHeight = 0;
    this.rows = 0;
    this.cols = 0;

    this.#bufInit()
    this.#setFont()
    this.#resize()
    this.#addEventListeners()
  }
  #bufInit() {
    this.bufs.push(new Buffer("", ["Hello World!", "Second line ..."]))
    this.cbuf += 1
  }

  #resize() {
    this.rows = Math.floor(this.ctx.canvas.height / this.charHeight)
    this.cols = Math.floor(this.ctx.canvas.width / this.charWidth)
  }

  #setFont() {
    this.ctx.font = "16px monospace"
    this.charWidth = 10;
    this.charHeight = 22;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.bufs[this.cbuf].draw(this.ctx, this.rows, this.cols, this.charWidth, this.charHeight)
    this.ctx.fillStyle = "darkblue";
    this.ctx.fillText(this.mode, this.charWidth, this.charHeight * (this.rows - 1))
  }
  #keyup(_e: KeyboardEvent) {
  }

  #keydown(e: KeyboardEvent) {
    e.preventDefault()
    // handling logic
    {
      this.#updateState(e.key)
      if (this.mode == "normal") {
        this.#normalH(e)
      } else if (this.mode == "insert") {
        this.#insertH(e)
      }
    }
    // update changes
    this.draw()
  }
  #insertH(e: KeyboardEvent) { }
  #normalH(e: KeyboardEvent) {
    let arrlen = this.state.seq.length
    if (arrlen === 1) {
      if (this.state.seq[0] === "h") {
        vim.left(1, this.bufs[this.cbuf])
        this.#resetState();
      } else if (this.state.seq[0] === "j") {
        vim.down(1, this.bufs[this.cbuf])
        this.#resetState();
      } else if (this.state.seq[0] === "k") {
        vim.up(1, this.bufs[this.cbuf])
        this.#resetState();
      } else if (this.state.seq[0] === "l") {
        vim.right(1, this.bufs[this.cbuf])
        this.#resetState();
      }
      else if (this.state.seq[0] === "w") {
        vim.word(1, this.bufs[this.cbuf])
        this.#resetState();
      } else {
        console.log("key pressed", e.key);
      }
    } else if (arrlen >= 2) {
      console.log("key pressed", this.state.seq);
    }
  }
  // #normalH(e: KeyboardEvent) {
  //   if (utils.isSpecial(e.key)) {
  //     switch (e.key) {
  //       case "Alt":
  //       case "Shift":
  //       case "AltGraph":
  //       case "Control":
  //         console.log("ignored special", e.key)
  //         break;
  //       case "Escape":
  //         this.#resetNormalState()
  //         break;
  //       case "Enter":
  //         break;
  //       case "Backspace":
  //         let count = this.normalState.hasNumber ? this.normalState.theNumber : 1
  //         vim.backspace(count, this.bufs[this.cbuf])
  //         break;
  //       case "Home":
  //         vim.home(this.bufs[this.cbuf])
  //         break;
  //       case "End":
  //         vim.end(this.bufs[this.cbuf])
  //         break;
  //       case "PageUp":
  //         console.log("unimplemented special", e.key)
  //         break;
  //       case "PageDown":
  //         console.log("unimplemented special", e.key)
  //         break;
  //       default:
  //         console.error("unhandled special", e.key)
  //     }
  //   } else {
  //     let count;
  //     switch (e.key) {
  //       case "0":
  //         if (this.normalState.hasNumber == false) {
  //           vim.home(this.bufs[this.cbuf])
  //           this.#resetNormalState();
  //         } else {
  //           this.normalState.theNumber *= 10
  //         }
  //         break;
  //       case "1":
  //       case "2":
  //       case "3":
  //       case "4":
  //       case "5":
  //       case "6":
  //       case "7":
  //       case "8":
  //       case "9":
  //         let num = parseInt(e.key, 10)
  //         if (this.normalState.hasNumber) {
  //           this.normalState.theNumber *= 10
  //           this.normalState.theNumber += num
  //         } else {
  //           this.normalState.hasNumber = true
  //           this.normalState.theNumber = num
  //         }
  //         break;
  //       case "a":
  //         this.mode = "insert"
  //         count = this.normalState.hasNumber ? this.normalState.theNumber : 1
  //         vim.right(count, this.bufs[this.cbuf])
  //         break;
  //       case "i":
  //         this.mode = "insert"
  //         break;
  //       case "h":
  //         count = this.normalState.hasNumber ? this.normalState.theNumber : 1
  //         vim.left(count, this.bufs[this.cbuf])
  //         break;
  //       case "j":
  //         count = this.normalState.hasNumber ? this.normalState.theNumber : 1
  //         vim.down(count, this.bufs[this.cbuf])
  //         break;
  //       case "k":
  //         count = this.normalState.hasNumber ? this.normalState.theNumber : 1
  //         vim.up(count, this.bufs[this.cbuf])
  //         break;
  //       case "l":
  //         count = this.normalState.hasNumber ? this.normalState.theNumber : 1
  //         vim.right(count, this.bufs[this.cbuf])
  //         break;
  //       case "f":
  //       case "t":
  //         if (this.normalState.hasCmd == false) {
  //           this.normalState.hasCmd = true
  //           this.normalState.theCmd = e.key
  //         } else {
  //           //run cmd
  //         }
  //         break;
  //       default:
  //         console.error("unhandled key", e.key)
  //     }
  //   }
  // }

  #resetState() {
    this.state.seq = []
    this.state.command = ""
    this.state.motion = ""
    this.state.count1 = 0
    this.state.count2 = 0
  }
  #updateState(key: string) {
    if (utils.isSpecial(key)) {
      switch (key) {
        case "Shift":
        case "Alt":
        case "AltGraph":
        case "Control":
          break;
        case "Escape":
          this.#resetState()
          break;
        case "PageUp":
        case "PageDown":
        case "Home":
        case "End":
        case "Enter":
        case "Backspace":
        case "Delete":
          this.state.seq.push(key)
          break;
        default:
          console.log("unhandled special key:", key)
      }
    } else {
      this.state.seq.push(key)
    }
  }

  #addEventListeners() {
    document.addEventListener("keyup", (e) => this.#keyup(e))
    document.addEventListener("keydown", (e) => this.#keydown(e))
  }

}

// function getTimes(s: string) {
//   let val = parseInt(s, 10)
//   if (isNaN(val)) {
//     console.log("nan found")
//     val = 1
//   }
//   return val
// }
