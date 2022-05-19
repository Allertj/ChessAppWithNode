import { authJwt } from '../middlewares/authJwt'
import { db } from '../models'
import { checkDuplicateUsername, checkDuplicateEmail, checkRolesExisted } from '../middlewares/verifySignUp'
import { signup } from "../controllers/auth.controller";
import { startGame, createNewGame } from '../controllers/game.controller'
import {Request, Response, Application}  from 'express'
require('dotenv').config();
import {UserModelDB} from '../models/user.model'
import {GameModelDB, GameModel} from '../models/game.model'

const Game = db.game;
const User = db.user;


const chessRoutes = (app: Application) => {
    app.get("/checkout", (req: Request, res : Response) => {
        res.send("SERVER WORKING PROPERLY")
        res.end()
    })
    app.post("/api/auth/signup",  [
        checkDuplicateUsername,
        checkDuplicateEmail,
        checkRolesExisted
    ], signup);

    app.get("/profile/:id/stats", authJwt.verifyToken, async (req : Request, res : Response) => {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            let user = await User.findOne({ _id: req.params.id })
            if (user) {  res.send({stats: user.stats, open_games: user.open_games}) }
            res.end()
        } catch (err) {
            res.send({ response: err }).status(400);
        }        
    })

    app.get("/profile/:id/open", authJwt.verifyToken, async (req : Request, res : Response) => {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            let user = await User.findOne({ _id: req.params.id })
            let games: Array<GameModel> = []
            if (user) {
            for (let game of user.open_games_ids) {
                let found = await Game.findOne({ _id: game  })
                if (found) { games.push(found) }
            }
            res.send(games)
        }
            res.end()
        } catch (err) {
            res.send({ response: err }).status(400);
        }        
    })

    app.get("/profile/:id/closed", authJwt.verifyToken, async (req : Request, res : Response) => {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            let games = await Game.find({ $or: [{ player0id: req.params.id  },
                                                { player1id: req.params.id  }],
                                          status: "Ended" })                                            
            res.send(games)
            res.end()
        } catch (err) {
            res.send({ response: err }).status(400);
        }
      });

      app.get("/requestgamedata/:gameid",  authJwt.verifyToken, async (req:Request, res : Response) => {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            let game = await Game.findOne({ _id: req.params.gameid})
            res.send(game)
            res.end()
        } catch (err) {
            res.send({ response: err }).status(400);
        }
    }); 
    app.post("/newgame", authJwt.verifyToken, async (req: Request, res: Response) => {
        let user = await User.findOne({ username: req.body.username })
        try {
        
          if (user && user.open_games >= (process.env.MAX_OPEN_GAMES ? process.env.MAX_OPEN_GAMES: 5000)) {
            res.send({ response: "All Slots filled" }).status(200);
            return; 
          } else {
            try {
                let game = await Game.findOne({ player1id: "0",
                                                player0id: { $ne: req.body.id }}) 
                if (!game) { createNewGame(req, res, user as UserModelDB)
                             return; } 
                startGame(req, res, game, user as UserModelDB)
                return              
            } catch (err) { 
                res.send({ response: err }).status(400);
                return; 
            }   
          }
        } catch (err) {
        }
    });
}

export {chessRoutes}