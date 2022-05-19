import {newgame} from './standardgame'
import {db} from '../models'
import {Request, Response} from 'express'
import {GameModelDB} from '../models/game.model'
import {UserModelDB} from '../models/user.model'

const Game = db.game;

const createNewGameinDB = async (player0id: String) => {
    const game = new Game({
      player0id: player0id,
      player1id: "0",
      gameasjson: newgame,
      status: "Open"
    });
    try {
        let saved = await game.save()
        return saved._id.toString()
    } catch (err) {
        return err
    }
  }

  const createNewGame = async (req : Request, res:Response, user:UserModelDB) => {
    let result = await createNewGameinDB(user._id)
    if (typeof result === "string") {
      user.open_games += 1 
      user.open_games_ids.push(result)
      user.save()
      res.send({ response: "New Game started, invite open." }).status(200);
      return
    } else {
      res.send({ response: result as string }).status(400);
      return
    }
}

const startGame = async (req: Request, res: Response, game: GameModelDB, user: UserModelDB) => {
    try {
        game.time_started = new Date().toUTCString()
        game.status = "Playing"
        game.player1id = user._id  
        await game.save()
        user.open_games += 1 
        user.open_games_ids.push(game._id.toString())
        await user.save()  
        res.send({ response: "Joined New Game. Ready to play" }).status(200);
    } catch (err) {
        res.status(500).send({ message: err as string});
        return; 
    }
}

  export {createNewGame, startGame}
