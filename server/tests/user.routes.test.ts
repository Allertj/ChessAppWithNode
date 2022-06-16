import express from 'express'
import request from 'supertest'
import { authRoutes } from '../routes/auth.routes'
import { userRoutes } from '../routes/user.routes'
import cors from 'cors';
import { createUser } from '../controllers/auth.controller'
import { connect, closeDatabase, clearDatabase } from './db'
import { db } from '../models'
import dotenv from 'dotenv';
dotenv.config();

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

authRoutes(app)
userRoutes(app)

const User = db.user;
const Role = db.role;


beforeAll(async () => {
    await connect()
    let user = new Role({  name: "user" })
    await user.save()
    let moderator = new Role({  name: "moderator"})
    await moderator.save()
    let admin = new Role({ name: "admin"})
    await admin.save()
})

afterAll(async () => {
    await clearDatabase()
    await closeDatabase()
})

test("GET /api/test/all", async () => {
    const res = await request(app).get("/api/test/all")
    expect(res.text).toBe("Public Content.")  
});

test("GET /api/test/user", async () => {
    const newuser = await createUser("someusername12", "some@email.com12", "password12", null)
    const founduser = await User.findOne({ username: "someusername12"})
    if (founduser) {
        let res = await request(app)
            .post("/api/auth/signin")
            .type('form')
            .send({ username: 'someusername12', password: 'password12'})
        let token = JSON.parse(res.text).accessToken
    let newres = await request(app)
        .get(`/api/test/user`)
        .set('x-access-token', token)
    expect(newres.text).toBe('User Content.')    
    }
})

test("GET /api/test/mod", async () => {
    const newuser = await createUser("someusername", "some@email.com", "password", null)
    const role = await Role.findOne({ name: "moderator"})
    await User.findOneAndUpdate({ username: "someusername"}, {roles: [role]})
    const founduser = await User.findOne({ username: "someusername"})
    if (founduser) {
        let res = await request(app)
            .post("/api/auth/signin")
            .type('form')
            .send({ username: 'someusername', password: 'password'})
        let token = JSON.parse(res.text).accessToken
    let newres = await request(app)
        .get(`/api/test/mod`)
        .set('x-access-token', token)
    expect(newres.text).toBe('Moderator Content.')    
    }
})

test("GET /api/test/admin", async () => {
    const newuser = await createUser("someusername123", "some123@email.com", "password123", null)
    const role = await Role.findOne({ name: "admin"})
    await User.findOneAndUpdate({ username: "someusername123"}, {roles: [role]})
    const founduser = await User.findOne({ username: "someusername123"})
    if (founduser) {
        let res = await request(app)
            .post("/api/auth/signin")
            .type('form')
            .send({ username: 'someusername123', password: 'password123'})
        let token = JSON.parse(res.text).accessToken
    let newres = await request(app)
        .get(`/api/test/admin`)
        .set('x-access-token', token)
    expect(newres.text).toBe('Admin Content.')    
    }
})

