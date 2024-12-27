# The vim commands are structured:[count][command][count][motion]

## Operator List:
    - c change,
    - d delete,
    - y yank into register(does not change the text),
    - ~ swap case (only if 'tildeop' is set),
    - g~ swap case,
    - gu make lowercase,
    - gU make uppercase,
    - ! filter through an external program
    - = filter through 'equalprg' or C-indeting if empty???
    - gq text formatting,
    - gw text formatting with no cursor movement,
    - g? ROT13 encoding,
    - > shift right,
    - < shift left,
    - zf define a fold
    - g@ call function set with the 'operatorfunc' option
## Command Multiplication
if command and motion both have count value before them they are multiplied
for exmaple 2y3y yanks 6 lines
