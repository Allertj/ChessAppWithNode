const express = require('express'); 
const socketIO = require('socket.io');
const cors = require('cors')
const http = require('http')

const MAX_OPEN_GAMES = 1000
const MAX_TOTAL_GAMES = 1000

const dbConfig = require('./config/db.config.js') 
// const port = process.env.PORT|| 3000 // setting the port
let app = express();
let server = http.createServer(app)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors())

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const db = require("./models");
const Role = db.role;
const Game = db.game;
const User = db.user;

const PORT = 5000
const io = require('socket.io')(server, {cors: {origin: "*"}});
file1 = require('./sockethandling')(io)

const { verifySignUp, authJwt } = require("./middlewares");
const controller = require("./controllers/auth.controller");

app.post("/api/auth/signup",  [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted
    ], controller.signup
);

app.get("/profile/:id", authJwt.verifyToken, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  Game.find({ $or: [{ player0id: req.params.id  },
                    { player1id: req.params.id  }] },
  ).exec((err,games ) => {
      // console.log(games)
      res.send(games)
      res.end()
  })
});



app.get("/requestgamedata/:gameid",  authJwt.verifyToken, async (req, res) => {
    // console.log("RECEIVED", req.params.gameid)
    res.header("Access-Control-Allow-Origin", "*");
    Game.findOne({
      _id: req.params.gameid
    }).exec((err, game) => {    
        res.send(game)
        res.end()
    })
}); 

const createNewGame = (req, res, user) => {
    // console.log("NEWGAMECC")
    controller.createNewGame(req.body.id, (err, game) => {
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

app.post("/newgame", authJwt.verifyToken, (req, res) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.send({ response: err }).status(400);
            return
        }
        if (user.open_games >= MAX_OPEN_GAMES || user.total_games >= MAX_TOTAL_GAMES) {
            res.send({ response: "All Slots filled" }).status(200);
            return
        }  else {
                Game.findOne({
                    player1id: "0",
                    player0id: { $ne: req.body.id } 
            }).exec((err,game ) => {
                // console.log(game, "FOUND GAME", err)
                if (err) { res.send({ response: err }).status(400);
                           return }
                if (!game) {
                    createNewGame(req, res, user)
                    return
                } 
                game.time_started = new Date().toUTCString()
                game.status = "Playing"
                game.player1id = req.body.id   
                game.save(err => { 
                    if (err) { 
                        res.status(500).send({ message: err });
                        return; 
                    }})  
                user.open_games_ids.push(game._id)
                user.total_games += 1
                user.save()
                // user.save(err => {  if (err) { 
                                    // res.status(500).send({ message: err });
                                    // return; 
                    // }})      
                res.send({ response: "Joined New Game. Ready to play" }).status(200);
                return      

            })
        }})
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({  name: "user" }).save(err => {
          if (err) {  console.log("error", err); }
          console.log("added 'user' to roles collection");
        });
        new Role({  name: "moderator"}).save(err => {
          if (err) {  console.log("error", err); }
          console.log("added 'moderator' to roles collection");
        });
        new Role({  name: "admin" }).save(err => {
          if (err) {  console.log("error", err); }
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }

server.listen(PORT, ()=>{
  console.log("Application running successfully on port: "+PORT);
});

