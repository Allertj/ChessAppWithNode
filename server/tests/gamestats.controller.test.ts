import { createUser } from '../controllers/auth.controller'
import { createNewGameinDB } from '../controllers/game.controller'
import { editGame } from '../controllers/gamestats.controller'
import { connect, closeDatabase, clearDatabase } from './db'
import { db } from '../models'

const User = db.user;
const Game = db.game;

beforeAll(async () => {
    await connect()
})

afterEach(async () => {
    await clearDatabase()
})

afterAll(async () => {
    await closeDatabase()
})

test("database edit game", async () => {
    const newuser = await createUser("someusername", "some@email.com", "password", null)
    const founduser = await User.findOne({ username: "someusername"})
    if (founduser) {
        const newgameid = await createNewGameinDB(founduser)
        const foundgame = await Game.findOne({ _id: newgameid})
        if (foundgame) {
            const something = JSON.stringify({something: "something"})
            await editGame(newgameid as String, {status: "Player1",
                                                 result: something,   
                                                 draw_proposed: something,
                                                 unverified_move: something, 
                                                 gameasjson : something})
            const foundgame2 = await Game.findOne({ _id: newgameid})
            if (foundgame2) {
                expect(foundgame2.status).toBe("Player1")
                expect(foundgame2.result).toBe(something)
                expect(foundgame2.draw_proposed).toBe(something)
                expect(foundgame2.gameasjson).toBe(something)
            }
        }
    }
})



