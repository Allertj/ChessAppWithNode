import express from 'express';
import cors from 'cors';
import http from 'http';
import { dbConfig } from './config/db.config' 

const MAX_OPEN_GAMES = 1000
const MAX_TOTAL_GAMES = 1000

// const port = process.env.PORT|| 3000 // setting the port
let app = express();
let server = http.createServer(app)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    //@ts-expect-error  
app.options('*', cors())


import {authRoutes} from './routes/auth.routes'
import {userRoutes} from './routes/user.routes'

authRoutes(app)
userRoutes(app)
// require('./routes/auth.routes')(app);
// require('./routes/user.routes')(app);

import {db} from './models'
// const db = require("./models");
const Role = db.role; 
const Game = db.game;
const User = db.user;

const PORT = 5000
const io = require('socket.io')(server, {cors: {origin: "*"}});
// const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();
import {startSocket} from './sockethandling'
startSocket(io)

import { checkDuplicateUsernameOrEmail, checkRolesExisted } from './middlewares/verifySignUp'
import { authJwt } from './middlewares/authJwt'
import { signup, signin, createNewGameinDB } from "./controllers/auth.controller";


app.post("/api/auth/signup",  [
        checkDuplicateUsernameOrEmail,
        checkRolesExisted
    ], signup
);

app.get("/profile/:id", authJwt.verifyToken, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let games = await Game.find({ $or: [{ player0id: req.params.id  },
                                      { player1id: req.params.id  }] },)
  try {
      res.send(games)
      res.end()
  } catch (err) {
      // res.end()
  }
});



app.get("/requestgamedata/:gameid",  authJwt.verifyToken, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    let game = await Game.findOne({ _id: req.params.gameid})
    try {
        res.send(game)
        res.end()
    } catch (err) {

    }
}); 

const createNewGame = (req :any, res:any, user:any) => {
    // console.log("NEWGAMECC")
    createNewGameinDB(req.body.id, (err:any, game:any) => {
        if (err) {  res.send({ response: err }).status(400);
                    return}
        user.open_games += 1 
        user.open_games_ids.push(game._id)
        user.total_games += 1
        user.save()
            //   if (err) { 
                //   res.status(500).send({ message: err });
                //   return; 
            //   }})  
        res.send({ response: "New Game started, invite open." }).status(200);
        return
    })
}

app.post("/newgame", authJwt.verifyToken, async (req, res) => {
    let user = await User.findOne({ username: req.body.username })
    try {
      if (user.open_games >= MAX_OPEN_GAMES || user.total_games >= MAX_TOTAL_GAMES) {
        res.send({ response: "All Slots filled" }).status(200);
        return; 
      } else {
        let game = await Game.findOne({ player1id: "0",
                                        player0id: { $ne: req.body.id }}) 
        try {
          if (!game) { createNewGame(req, res, user)
                       return; } 
          game.time_started = new Date().toUTCString()
          game.status = "Playing"
          game.player1id = req.body.id   
          game.save((err:any)=> { 
              if (err) { 
                  res.status(500).send({ message: err });
                  return; 
              }})  
          user.open_games_ids.push(game._id)
          user.total_games += 1
          user.save()  
          res.send({ response: "Joined New Game. Ready to play" }).status(200);
          return              
        } catch (err) { 
          res.send({ response: err }).status(400);
          return; 
        }   
      }
    } catch (err) {
    }
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
      //@ts-expect-error  
  useNewUrlParser: true,

    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err :any) => {
    console.error("Connection error", err);
    process.exit();
  });

  function initial() {
    Role.estimatedDocumentCount((err:any, count:any) => {
      if (!err && count === 0) {
        new Role({  name: "user" }).save((err:any) => {
          if (err) {  console.log("error", err); }
          console.log("added 'user' to roles collection");
        });
        new Role({  name: "moderator"}).save((err:any) => {
          if (err) {  console.log("error", err); }
          console.log("added 'moderator' to roles collection");
        });
        new Role({  name: "admin" }).save((err:any) => {
          if (err) {  console.log("error", err); }
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

server.listen(PORT, ()=>{
  console.log("Application running successfully on port: "+PORT);
});

