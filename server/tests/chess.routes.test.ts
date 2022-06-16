import express from 'express'
import request from 'supertest'
import { authRoutes } from '../routes/auth.routes'
import { chessRoutes } from '../routes/chess.routes'
import { db } from '../models'
import cors from 'cors';
import { createUser } from '../controllers/auth.controller'
import { createNewGameinDB, startGameInDB } from '../controllers/game.controller'
// import lodash from 'lodash'
// import { newgame } from '../controllers/standardgame'

import { connect, closeDatabase, clearDatabase } from './db'
import dotenv from 'dotenv';

dotenv.config();

const User = db.user;

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

authRoutes(app)
chessRoutes(app)

let token : string = ""
let id : string = ""
let gameid: any = ""

beforeAll(async () => {
    await connect()
    const newuser = await createUser("bbb", "bbb@email.com", "bbb", null)
    let res = await request(app)
            .post("/api/auth/signin")
            .type('form')
            .send({ username: 'bbb', password: 'bbb'})
    const founduser = await User.findOne({ username: "bbb"})
    if (founduser) {
        gameid = await createNewGameinDB(founduser)
    }
    token = res.body.accessToken    
    id = res.body.id          
})

afterAll(async () => {
    await clearDatabase()
    await closeDatabase()
})

test("GET /profile/id/stats", async () => {
    let res = await request(app)
        .get(`/profile/${id}/stats`)
        .set('x-access-token', token)
    let result = JSON.parse(res.text)
    expect(result.open_games).toBe(1)
    expect(result.stats).toBe("{\"W\":0, \"D\":0, \"L\":0}")
});

test("GET /profile/id/stats - Fail - No Token", async () => {
    let res = await request(app)
        .get(`/profile/${id}/stats`)
    expect(res.text).toBe(JSON.stringify({"message":"No token provided!"}))    
});

test("GET /profile/:id/open" , async () => {
    let res = await request(app)
        .get(`/profile/${id}/open`)
        .set('x-access-token', token)
    let result = JSON.parse(res.text)
    expect(result[0].player0id).toBe(id)
    expect(JSON.parse(result[0].gameasjson)).toBeTruthy()
});

test("GET /requestgamedata/:gameid", async () => {
    let res = await request(app)
        .get(`/requestgamedata/${gameid}`)
        .set('x-access-token', token)
    let result = JSON.parse(res.text)
    expect(result._id).toBe(gameid)
    expect(result.player0id).toBe(id)
    expect(result.gameasjson).toBeTruthy()
});

test("GET /requestgamedata/:gameid", async () => {
    let res = await request(app)
        .get(`/requestgamedata/${gameid}`)
        .set('x-access-token', token)
    let result = JSON.parse(res.text)
    expect(result._id).toBe(gameid)
    expect(result.player0id).toBe(id)
    expect(result.gameasjson).toBeTruthy()
});

test("POST /newgame", async () => {
    let res = await request(app)
        .post("/newgame")
        .set('x-access-token', token)
        .type('form')
        .send({  username: "bbb", email: "bbb@email.com" }) 
    const founduser = await User.findOne({ username: "bbb"})
    if (founduser) {
        expect(founduser.open_games).toBe(2)
        expect(founduser.open_games_ids.length).toBe(2)
    } else {
        fail("User not found")
    }
})

test("GET /checkout", async () => {
    const res = await request(app).get("/checkout")
    expect(res.text).toBe("SERVER WORKING PROPERLY")  
});