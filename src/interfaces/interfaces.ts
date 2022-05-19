interface UserData {
    id :string
    accessToken: string
    username: string,
    email: string,
    stats : string,
    open_games: number,
    roles: Array<string>
}

interface GameAsJson {
    board: Array<Array<any | null>>
    castling: any
    color: number
    draw_proposed?: string
    id: string
    last_selected: Array<number>[]
    latest_poss: Array<number>[]
    moves: Array<any>[]
    movescount: number
    passed_pawn: any
    passed_pawn_removal: any
    promotion: {x: number, y: number, player: number}
    status: string
    turn: number
    unverified_move?: string
}

export type {UserData, GameAsJson}