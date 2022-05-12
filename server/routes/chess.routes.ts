import { authJwt } from '../middlewares/authJwt'
import { db } from '../models'
import { checkDuplicateUsername, checkDuplicateEmail, checkRolesExisted } from '../middlewares/verifySignUp'
import { signup } from "../controllers/auth.controller";
import Express from 'express';
import { startGame, createNewGame } from '../controllers/game.controller'
import { MAX_OPEN_GAMES, MAX_TOTAL_GAMES } from '../../src/config'

const Role = db.role; 
const Game = db.game;
const User = db.user;

const chessRoutes = (app: any) => {
    app.get("/checkout", (req: any, res : any) => {
        res.send("SERVER WORKING PROPERLY")
        res.end()
    })
    app.post("/api/auth/signup",  [
        checkDuplicateUsername,
        checkDuplicateEmail,
        checkRolesExisted
    ], signup);

    app.get("/profile/:id", authJwt.verifyToken, async (req : Express.Request, res : Express.Response) => {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            let games = await Game.find({ $or: [{ player0id: req.params.id  },
                                                { player1id: req.params.id  }] },)
            res.send(games)
            res.end()
        } catch (err) {
            res.send({ response: err }).status(400);
        }
      });

      app.get("/requestgamedata/:gameid",  authJwt.verifyToken, async (req : Express.Request, res : Express.Response) => {
        res.header("Access-Control-Allow-Origin", "*");
        try {
            let game = await Game.findOne({ _id: req.params.gameid})
            res.send(game)
            res.end()
        } catch (err) {
            res.send({ response: err }).status(400);
        }
    }); 
    app.post("/newgame", authJwt.verifyToken, async (req: any, res: any) => {
        let user = await User.findOne({ username: req.body.username })
        try {
          if (user.open_games >= MAX_OPEN_GAMES || user.total_games >= MAX_TOTAL_GAMES) {
            res.send({ response: "All Slots filled" }).status(200);
            return; 
          } else {
            try {
                let game = await Game.findOne({ player1id: "0",
                                                player0id: { $ne: req.body.id }}) 
                if (!game) { createNewGame(req, res, user)
                             return; } 
                startGame(req, res, game, user)
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