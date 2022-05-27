import { Piece} from './piece'
import { Player, validNumbers } from './misc'

export class Pawn extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "P")
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let heading = new Map([[Player.WHITE, 1], [Player.BLACK, -1]]);
        let starts = new Map([[Player.WHITE, 2], [Player.BLACK, -2]]);
        let possible : Array<[number, number]>  = [];
        let index2 = Number(heading.get(this.player));
        if (validNumbers(x+index2, y) && !board[x + index2][y]) {
            possible.push([x + index2, y]);
            if (!this.moved) {
                let index = Number(starts.get(this.player));
                if (validNumbers(x+index, y) && !board[x + index][y]) {
                    possible.push([x + index, y]);
                }
            }
        }
        let strikes1 = new Map([[Player.WHITE, [[x + 1, y - 1], [x + 1, y + 1]]],
                                [Player.BLACK, [[x - 1, y - 1], [x - 1, y + 1]]]]);
        //@ts-expect-error
        for (let [x1, y1] of strikes1.get(this.player)) {
            if (validNumbers(x1, y1) && board[x1][y1] !== null && board[x1][y1]?.player !== this.player) {
                possible.push([x1, y1]);
            }
        }
        return possible;
    }
    get letter() {
        return this.typeletter;
    }
}
