const validNumbers = (x: number, y: number): boolean => {
    if (x >= 0 && y >= 0 && x <= 7 && y <= 7) {
        return true;
    }
    return false;
}

const linemakerCheck = (board: Array<Array<Piece | null>>, x: number, y: number, t1: number, t2: number, player:Player, piece: Array<string>) : boolean => {
    for (let i = 1; i < 8; i++) {
        if (x + (t1 * i) >= 0 && y + (t2 * i) >= 0 && x + (t1 * i) <= 7 && y + (t2 * i) <= 7) {
            if (board[x + (t1 * i)][y + (t2 * i)] !== null) {
                let current = board[x + (t1 * i)][y + (t2 * i)];
                if (current && current.player === player) { return false}
                if (current && current.player !== player) {
                    if (current.letter && !piece.includes(current.letter.toString())) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

const linemaker = (board: Array<Array<Piece | null>>, x: number, y: number, t1: number, t2: number, player: Player, piece: String = "") : Array<[number, number]> => {
    let possible : Array<[number, number]> = []
    for (let i = 1; i < 8; i++) {
        if (x + (t1 * i) >= 0 && y + (t2 * i) >= 0 && x + (t1 * i) <= 7 && y + (t2 * i) <= 7) {
            if (board[x + (t1 * i)][y + (t2 * i)] !== null) {
                let current = board[x + (t1 * i)][y + (t2 * i)];
                if (current?.player === player) {
                    break;
                }
                else {
                    possible.push([(x + (t1 * i)), (y + (t2 * i))]);
                    break;
                }
            }
            possible.push([(x + (t1 * i)), (y + (t2 * i))]);
        }
    }
    return possible;
};

enum Player { BLACK, WHITE}

abstract class Piece {
    x: number;
    y: number;
    moved: boolean = false
    player: Player
    typeletter: string
    constructor(x: number, y: number, player: Player, moved: boolean = false, typeletter: string) {
        this.x = x
        this.y = y
        this.moved = moved
        this.player = player
        this.typeletter = typeletter
    }
    abstract getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]>
    abstract get letter() : String    
}

class Rook extends Piece {
    // typeletter: string
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "R")
        // this.typeletter = "R"
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss1 = linemaker(board, x, y,  0,  1, this.player);
        let poss2 = linemaker(board, x, y,  0, -1, this.player);
        let poss3 = linemaker(board, x, y,  1,  0, this.player);
        let poss4 = linemaker(board, x, y, -1,  0, this.player);
        return poss1.concat(poss2, poss3, poss4);
    }
    get letter() {
        return this.typeletter;
    }
}

class Bishop extends Piece {
    // typeletter : string
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "B")
        // this.typeletter = "B"
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss1 = linemaker(board, x, y, 1, 1, this.player);
        let poss2 = linemaker(board, x, y, -1, -1, this.player);
        let poss3 = linemaker(board, x, y, 1, -1, this.player);
        let poss4 = linemaker(board, x, y, -1, 1, this.player);
        return poss1.concat(poss2, poss3, poss4);
    }
    get letter() {
        return this.typeletter;
    }
}

class Knight extends Piece {
    // typeletter : string
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "K")
        // this.typeletter = "K"
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss = [[2, -1], [2, 1], [-2, -1], [-2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
        let possible: Array<[number, number]> = [];
        poss.forEach(element => {
            if (element[0] + x >= 0 && element[1] + y >= 0 && element[0] + x <= 7 && element[1] + y <= 7) {
                let loc = board[element[0] + x][element[1] + y];
                if (loc && loc.player === this.player) { }
                else {
                    possible.push([(element[0] + x), (element[1] + y)]);
                }
            }
        });
        return possible;
    }
    get letter() {
        return this.typeletter;
    }
}

class Queen extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "Q")
    }
    getMovements(board: Array<Array<Piece | null >>, x: number, y: number): Array<[number, number]> {
        let poss1 = linemaker(board, x, y, 1, 1, this.player);
        let poss2 = linemaker(board, x, y, -1, -1, this.player);
        let poss3 = linemaker(board, x, y, 1, -1, this.player);
        let poss4 = linemaker(board, x, y, -1, 1, this.player);
        let poss5 = linemaker(board, x, y, 0, 1, this.player);
        let poss6 = linemaker(board, x, y, 0, -1, this.player);
        let poss7 = linemaker(board, x, y, 1, 0, this.player);
        let poss8 = linemaker(board, x, y, -1, 0, this.player);
        return poss1.concat(poss2, poss3, poss4, poss5, poss6, poss7, poss8);
    }
    get letter() {
        return this.typeletter;
    }
}

class King extends Piece {
    constructor(x: number, y: number, player: Player, moved: boolean = false) {
        super(x, y, player, moved, "M")
    }
    getMovements(board: Array<Array<Piece | null>>, x: number, y: number): Array<[number, number]> {
        let poss = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1], [1, -1], [1, 0], [1, 1]];
        let possible : Array<[number, number]>  = [];
        poss.forEach(element => {
            if (element[0] + x >= 0 && element[1] + y >= 0 && element[0] + x <= 7 && element[1] + y <= 7) {
                if (board[element[0] + x][element[1] + y] === null || board[element[0] + x][element[1] + y]?.player !== this.player) {
                    possible.push([(element[0] + x), (element[1] + y)]);
                }
            }
        });
        return possible;
    }
    get letter() {
        return this.typeletter;
    }
}

class Pawn extends Piece {
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

enum status1 {PLAYING = "Playing", 
              CHECKMATE = "Checkmate",
              PROMOTION = "Promotion", 
              CHECK = "Check", 
              STALEMATE = "Stalemate"}

class Game {
    board : Array<Array<Piece | null>> = []
    turn : Player =  Player.BLACK
    id : number = 0
    player0id : number = 0
    player1id : number = 0
    color: number = 2
    status = status1.PLAYING
    passed_pawn = new Map()
    passed_pawn_removal = new Map()
    castling = new Map()
    promotion = {x : 8, y : 8, player : 2}
    latest_poss: Array<[number, number]>= []
    moves = []
    movescount = 0
    last_selected = []
    constructor(gameInfo: string="") {
        if (this.board.length === 0) {
            this.buildBoard(gameInfo)
        }
    }
    get currentStatus() {
        return this.status;
    }
    get last_selected_as_string() {
                //@ts-expect-error
        return !this.last_selected ?  this.last_selected[0].toString()+this.last_selected[1].toString() : ""
    }
    get latest_poss_as_string () {
        return this.latest_poss.map(value => value[0].toString()+value[1].toString())
    }
    getMoves() {
        let result = []
        let players = new Map([[1, "WHITE"], [0, "BLACK"]])
        let letter = new Map([[7, "A"], [6, "B"], [5, "C"], [4, "D"], [3, "E"], [2, "F"], [1, "G"], [0, "H"]])
        for (let [player, x, y, destx, desty, count, strike, piece] of this.moves) {
            result.push({player: players.get(player), 
                         piece: piece, 
                         notation: letter.get(y)+(x+1).toString()+strike+letter.get(desty)+(destx+1).toString()})
        }
        return result
    }
    getPossibilities(player: Player, x: number, y: number, forlegal: boolean) {
        if (!forlegal) { if (Number(player) === Number(this.turn)) {return []}}
        let temp : Array<[number, number]>= [];
        if (this.board[x][y] && this.board[x][y]?.player === player) {
            let poss = this.board[x][y]?.getMovements(this.board, x, y);
            if (this.passed_pawn.has([x, y].join(","))) {
                        //@ts-expect-error
                poss.push(this.passed_pawn.get([x, y].join(",")));
            }
                    //@ts-expect-error
            poss.forEach(value => {
                if (this.moveLegal(this.board, x, y, value[0], value[1], player)) {
                    temp.push(value);
                }
            });
            if (this.board[x][y]?.letter === "M") {
                let result = this.checkCastling(this.board, x, y, player);
                        //@ts-expect-error
                result.forEach(value => temp.push(value));
            }
        }
        if (!forlegal) {
            this.latest_poss = temp
                    //@ts-expect-error
            this.last_selected = [x, y]
        }
        return temp;
    }
    moveLegal(board: Array<Array<Piece | null>>, x: number, y: number, destx: number, desty: number, player: Player) {
        let temp = board[x][y];
        let dd;
        delete board[x][y];
        //@ts-expect-error
        [temp.x, temp.y] = [destx, desty];
        if (board[destx][desty]) {
            dd = board[destx][desty];
        }
        board[destx][desty] = temp;
        let aa = this.checkForCheck(player, board);
        board[x][y] = temp;
                //@ts-expect-error
        [temp.x, temp.y] = [x, y];

        board[destx][desty] = null;
        if (dd) {
            board[destx][desty] = dd;
        }
        return !aa;
    }
    checkIfAnyLegalMove(player: Player) {
        for (let piece of this.board.flat()) {
            if (piece && piece.player !== player) {
                let movements = this.getPossibilities(piece.player, piece.x, piece.y, true);
                if (movements.length > 0) {
                    return true;
                }
            }
        }
        return false;
    }
    checkStatus(player: Player) {
        let checkPlayer = 1 - this.turn;
        let inCheck = this.checkForCheck(checkPlayer, this.board);
        let legalMoves = this.checkIfAnyLegalMove(player);
        switch (true) {
            case (inCheck === true && legalMoves === false): return status1.CHECKMATE;
            case (inCheck === false && legalMoves === false): return status1.STALEMATE;
            case (inCheck === true && legalMoves === true): return status1.CHECK;
            default: return status1.PLAYING;
        }
    }
    movePossible(x: number, y: number, destx: number, desty: number) {
                //@ts-expect-error
        for (let move of this.board[x][y].getMovements(this.board, x, y)) {
            if (move[0] === destx && move[1] === desty) {
                return true;
            }
        }
        return false;
    }
    checkPromotion(piece: Piece) {
        if (piece && piece.letter === "P") {
            if (piece.player === Player.WHITE && piece.x === 7) {
                [this.promotion.x, this.promotion.y, this.promotion.player] = [piece.x, piece.y, piece.player];
                this.status = status1.PROMOTION;
            }
            if (piece.player === Player.BLACK && piece.x === 0) {
                [this.promotion.x, this.promotion.y, this.promotion.player] = [piece.x, piece.y, piece.player];
                this.status = status1.PROMOTION;
            }
        }
    }
    checkPassedPawn(x: number, y: number, destx: number, desty: number, player: Player) {
        if (Math.abs(destx - x) === 2 && this.board[destx][desty - 1] && this.board[destx][desty - 1]?.player !== player) {
            this.passed_pawn.set([destx, desty - 1].join(","), [(destx + x) / 2, desty]);
            this.passed_pawn_removal.set([(destx + x) / 2, desty].join(","), [destx, desty]);
        }
        if (Math.abs(destx - x) === 2 && this.board[destx][desty + 1] && this.board[destx][desty + 1]?.player !== player) {
            this.passed_pawn.set([destx, desty + 1].join(","), [(destx + x) / 2, desty]);          
            this.passed_pawn_removal.set([(destx + x) / 2, desty].join(","), [destx, desty]);
        }
    }
    makeMoveInternal(board: any, x: number, y: number, destx: number, desty: number) {
        let temp = board[x][y];
        board[x][y] = null;
        [temp.x, temp.y] = [destx, desty];
        board[destx][desty] = temp;
        temp.moved = true;
        this.passed_pawn.clear();
        this.passed_pawn_removal.clear()
    }
    makeCastling(x: number, y: number, destx: number, desty: number) {
        let rookmovement = new Map([["0", 2], ["7", 5]]);
        let kingmovement = new Map([["0", 1], ["7", 6]]);
        //@ts-expect-error
        this.makeMoveInternal(this.board, destx, desty, destx, rookmovement.get(desty.toString()));
        //@ts-expect-error
        this.makeMoveInternal(this.board, x, y, destx, kingmovement.get(desty.toString()));
    }
    makeMove(board: any, x: number, y: number, destx: number, desty: number, player: Player) {
        this.latest_poss = []
        this.last_selected = []
        this.movescount += 1
        let strike = board[destx][desty] ? " X " : " - "
                //@ts-expect-error
        this.moves.push([this.board[x][y].player, x, y, destx, desty, this.movescount, strike, this.board[x][y].letter])
        // if (player !== this.turn) { return false; }
        if (this.passed_pawn.has([x, y].join(",")) && board[x][y].letter === "P") {
            if (this.passed_pawn.get([x, y].join(",")).join(",") === [destx, desty].join(",")) {
                let [x1, y1] = this.passed_pawn_removal.get([destx, desty].join(","))
                board[x1][y1] = null
            }
        }
        if (this.castling.has([destx, desty].join(","))) {
            this.makeCastling(x, y, destx, desty);

            this.turn = 1 - this.turn;
            this.castling.clear();
            return true;
        }
        this.makeMoveInternal(this.board, x, y, destx, desty);
        this.turn = 1 - this.turn;
        this.latest_poss = []
        this.last_selected = []
        this.status = this.checkStatus(this.turn);
        if (board[destx][desty].letter === "P") {
            this.checkPromotion(board[destx][desty]);
            this.checkPassedPawn(x, y, destx, desty, player);
        }
    }
    validNumbers(x: number, y: number) {
        if (x >= 0 && y >= 0 && x <= 7 && y <= 7) {
            return true;
        }
        return false;
    }
    checkCastling(board: Array<Array<Piece | null>>, x: number, y: number, player: Player) {
        let possible = [];
        if (!board[x][y]?.moved && (board[x][y + 4] || board[x][y - 3])) {
            if (board[x][y + 4] && board[x][y + 4]?.constructor.name === "Rook" && board[x][y + 4]?.moved === false) {
                if (board[x][y + 1] === null && board[x][y + 2] === null && board[x][y + 3] === null) {
                    let rookmove = this.moveLegal(this.board, x, y + 4, x, y + 3, player);
                    let kingmove = this.moveLegal(this.board, x, y, x, y + 2, player);
                    if (rookmove && kingmove) {
                        this.castling.set([x, y + 4].join(","), [x, y]);
                        possible.push([x, y + 4]);
                    }
                }
            }
            if (board[x][y - 3] && board[x][y - 3]?.constructor.name === "Rook" && board[x][y - 3]?.moved === false) {
                if (board[x][y - 1] === null && board[x][y - 2] === null) {
                    let rookmove = this.moveLegal(this.board, x, y - 3, x, y - 1, player);
                    let kingmove = this.moveLegal(this.board, x, y, x, y - 2, player);
                    if (rookmove && kingmove) {
                        this.castling.set([x, y - 3].join(","), [x, y]);
                        possible.push([x, y - 3]);
                    }
                }
            }
        }
        return possible;
    }
    checkForCheck(player: Player, board:Array<Array<Piece | null>>) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < 8 ; i++) {
            for (let j = 0; j < 8 ; j++) {
                let piece = board[i][j]
                if (piece && piece.letter === "M" && piece.player === player) {

                    [x, y] = [piece.x, piece.y];
                }
            }
        }
        let rqposs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let [px, py] of rqposs) {
            if (linemakerCheck(board, x, y, px, py, player, ["R", "Q"])) {
                return true;
            }    
        }
        let bqposs = [[1, -1], [-1, 1], [-1, -1], [1, 1]];
        for (let [px, py] of bqposs) {
            if (linemakerCheck(board, x, y, px, py, player, ["B", "Q"])) {
                return true;
            }   
        }    
        let strikes1 = [[[x - 1, y - 1], [x - 1, y + 1]], [[x + 1, y - 1], [x + 1, y + 1]]]
        for (let [x1, y1] of strikes1[player]) {
            if (this.validNumbers(x1, y1)) {
                if (board[x1][y1] && board[x1][y1]?.letter === "P" && board[x1][y1]?.player !== player) {
                    return true
                }
            }
        }                        
        let poss = [[2, -1], [2, 1], [-2, -1], [-2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
        for (let [kx, ky] of poss) {
            if (this.validNumbers(kx + x, ky + y)) {
                if (board[kx + x][ky + y] && board[kx + x][ky + y]?.letter === "K" && board[kx + x][ky + y]?.player !== player) {
                    return true
                }
            }   
        }
        return false;
    }
    getPiece(x: number, y: number) {
        return this.board[x][y]
    }
    getInstanceOfPiece(x: number, y: number, letter: string, player: Player, moved: boolean) {
        switch (letter) {
            case "R": return new Rook(x, y, player, moved);
            case "B": return new Bishop(x, y, player, moved);
            case "Q": return new Queen(x, y, player, moved);
            case "K": return new Knight(x, y, player, moved);
            case "M": return new King(x, y, player, moved);
            case "P": return new Pawn(x, y, player, moved);
            default : return null
        }
    }
    promotePiece(x: number, y: number, player: Player, choice: string) {
        let newpiece = this.getInstanceOfPiece(x, y, choice, player, true)
        this.board[x][y] = newpiece
        this.promotion = {x : 8, y : 8, player : 2}
    }
    buildBoard(gamei: any) {
        let newBoard = Array(8).fill(null).map(x => Array(8).fill(null));
        for (const piece in gamei) {
            let [x, y, piec, moved, player] = gamei[piece];
            newBoard[x][y] = this.getInstanceOfPiece(x, y, piec, player, moved);
        }
        this.board = newBoard; 
    }
}
export {Player, Piece, Rook, King, Knight, Bishop, Queen, Pawn, Game}