import crypto from 'crypto';
import {newgame} from './standardgame'
import {db} from '../models'
const Game = db.game;

const createNewGameinDB = async (player0id: String) => {
    const id = crypto.randomBytes(16).toString("hex");
    const game = new Game({
      gameid: id,
      player0id: player0id,
      player1id: "0",
      gameasjson: newgame,
      status: "Open"
    });
    try {
        let saved = await game.save()
        return id
    } catch (err) {
        return err
    }
  }

  const createNewGame = async (req :any, res:any, user:any) => {
    let result = await createNewGameinDB(req.body.id)
    if (typeof result === "string") {
      user.open_games += 1 
      user.open_games_ids.push(result)
      user.total_games += 1
      user.save()
      res.send({ response: "New Game started, invite open." }).status(200);
      return
    } else {
      res.send({ response: result }).status(400);
      return
    }
}

const startGame = async (req: any, res: any, game:any, user: any) => {
    try {
        game.time_started = new Date().toUTCString()
        game.status = "Playing"
        game.player1id = req.body.id  
        await game.save()
        user.open_games_ids.push(game._id)
        user.total_games += 1
        await user.save()  
        res.send({ response: "Joined New Game. Ready to play" }).status(200);
    } catch (err) {
        res.status(500).send({ message: err });
        return; 
    }
}

  export {createNewGame, startGame}
