import { createUser } from '../controllers/auth.controller'
import { connect, closeDatabase, clearDatabase } from './db'
import { db } from '../models'

beforeAll(async () => {
    await connect()
})

afterEach(async () => {
    await clearDatabase()
})

afterAll(async () => {
    await closeDatabase()
})

test("database add user", async () => {
    const newuser = await createUser("someusername", "some@email.com", "password", null)
    const founduser = await db.user.findOne({ username: "someusername"})
    expect(founduser && founduser.username).toBe("someusername")
    expect(founduser && founduser.email).toBe("some@email.com")
})