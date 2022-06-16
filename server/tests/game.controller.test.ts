import { createNewGameinDB, startGameInDB } from '../controllers/game.controller'
import { createUser } from '../controllers/auth.controller'
import { db } from '../models'
import { connect, closeDatabase, clearDatabase } from './db'
import { newgame } from '../controllers/standardgame'
import lodash from 'lodash'

beforeAll(async () => {
    await connect()
})

afterEach(async () => {
    await clearDatabase()
})

afterAll(async () => {
    await closeDatabase()
})
const Game = db.game;
const User = db.user;

test("database add game", async () => {
    const newuser = await createUser("someusername", "some@email.com", "password", null)
    const founduser = await User.findOne({ username: "someusername"})
    if (founduser && newuser) {
    const new_user_open_games = newuser.open_games
    const newgameid = await createNewGameinDB(founduser)
    const foundgame = await Game.findOne({ _id: newgameid})
    expect(foundgame && foundgame.player0id).toBe(newuser._id)
    expect(foundgame && foundgame.player1id).toBe("0")
    expect(foundgame && foundgame.status).toBe("Open")
    expect(newuser.open_games).toBe(new_user_open_games+1)
    if (foundgame) {
        expect(newuser.open_games_ids).toContain(foundgame._id.toString())
    }
    if (foundgame) {
        let res = lodash.isEqual(JSON.parse(newgame).board, JSON.parse(foundgame.gameasjson as string).board)
        expect(res).toBe(true)
    }   
    }
})

test("database start game", async () => {
    const newuser = await createUser("someusername", "some@email.com", "password", null)
    const founduser = await User.findOne({ username: "someusername"})
    if (founduser) {
        const newgameid = await createNewGameinDB(founduser)
        const foundgame = await Game.findOne({ _id: newgameid})
        const current_open_games = founduser.open_games
        if (foundgame) {
        await startGameInDB(foundgame, founduser)
        expect(foundgame.status).toBe("Playing")
        expect(foundgame.player1id).toBe(founduser._id.toString())
        expect(new Date(foundgame.last_change as string).getTime()).toBeTruthy()
        expect(new Date(foundgame.time_started as string).getTime()).toBeTruthy()
        expect(founduser.open_games).toBe(current_open_games + 1)        
        expect(founduser.open_games_ids).toContain(foundgame._id.toString())
        }
    }
})