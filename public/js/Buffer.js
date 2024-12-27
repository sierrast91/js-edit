export default class Buffer {
    // public hl: string[]
    constructor(fn, lines) {
        this.cx_off = 0;
        this.cy_off = 0;
        this.cx = 0;
        this.cy = 0;
        this.cxr = 0;
        this.lines = lines;
        // this.hl = this.#initHL(this.lines)
        this.fn = fn;
    }
    // #initHL(lines: string[]) {
    //   let hl: string[] = []
    //   for (let line of lines) {
    //     let hlstr = ""
    //     for (let i = 0; i < line.length; i++) {
    //       hlstr += "x"
    //     }
    //     hl.push(hlstr)
    //   }
    //   return hl
    // }
    draw(ctx, row, col, chw, chh) {
        console.log("row", row, "col", col);
        for (let i = 0; i < row; i++) {
            let crow = i + this.cy_off;
            if (crow >= this.lines.length) {
                break;
            }
            for (let j = this.cx_off; j < col; j++) {
                let ccol = j + this.cx_off;
                if (ccol >= this.lines[crow].length) {
                    break;
                }
                let ch = this.lines[crow].charAt(ccol);
                // let color = this.hl[crow].charAt(ccol)
                // ctx.fillStyle = charToColor(color)
                ctx.fillStyle = "black";
                ctx.fillText(ch, chw + chw * ccol, chh + chh * crow);
            }
        }
        ctx.fillStyle = "black";
        ctx.fillRect(chw + chw * (this.cx - this.cx_off), chh + 5 + chh * (this.cy - this.cy_off), chw, -1 * chh);
        ctx.fillStyle = "white";
        ctx.fillText(this.lines[this.cy].charAt(this.cx), chw + chw * (this.cx - this.cx_off), chh + chh * (this.cy - this.cy_off));
    }
}
// function charToColor(ch: string) {
//   switch (ch) {
//     case "r": return "red"
//     case "g": return "green"
//     case "b": return "blue"
//     case "c": return "cyan"
//     case "p": return "purple"
//     default: return "black"
//   }
//   buf.cx = x;
//   buf.cy = y;
// }
