import express from 'express'
import request from 'supertest'
import { authRoutes } from '../routes/auth.routes'
import cors from 'cors';
import { db } from '../models'
import { createUser } from '../controllers/auth.controller'
import { connect, closeDatabase, clearDatabase } from './db'
import dotenv from 'dotenv';

dotenv.config();

const User = db.user;

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

authRoutes(app)

beforeAll(async () => {
    await connect()
    const newuser = await createUser("bbb", "bbb@email.com", "bbb", null)

})

afterAll(async () => {
    await clearDatabase()
    await closeDatabase()
})

test("POST /api/auth/signup Success", async () => {
    let res = await request(app)
        .post("/api/auth/signup")
        .type('form')
        .send({  username: "aaa", password: "aaa" ,email: "aaa@aaa.com" })
    let reaction = JSON.parse(res.text)
    expect(reaction.status).toBe(200)
    expect(reaction.message).toBe("User was registered successfully!")
})

test("POST /api/auth/signup Fail - Duplicate Username", async () => {
    let res = await request(app)
        .post("/api/auth/signup")
        .type('form')
        .send({  username: "bbb", password: "bbb" ,email: "bbb@email.com" })   
    let reaction = JSON.parse(res.text)
    expect(reaction.message).toBe("Failed! Username is already in use!")
})

test("POST /api/auth/signup Fail - Duplicate Email", async () => {
    let res = await request(app)
        .post("/api/auth/signup")
        .type('form')
        .send({  username: "ccc", password: "bbb" ,email: "bbb@email.com" }) 
    let reaction = JSON.parse(res.text)
    expect(reaction.message).toBe("Failed! Email is already in use!")
})

test("POST /api/auth/signin", async () => {
    const founduser = await User.findOne({ username: "bbb"})
    if (founduser) {
        let res = await request(app)
            .post("/api/auth/signin")
            .type('form')
            .send({ username: 'bbb', password: 'bbb'})
        expect(res.body.id).toBe(founduser._id.toString())
        expect(res.body.stats).toBeTruthy()
        expect(res.body.username).toBe("bbb")
        expect(res.body.email).toBe("bbb@email.com")
        expect(res.body.open_games).toBe(0)
        expect(res.body.roles).toBeTruthy()
        expect(res.body.accessToken).toBeTruthy()
    } else {
        fail('user not found');
    }
});
