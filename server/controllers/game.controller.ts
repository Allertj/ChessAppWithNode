import {newgame} from './standardgame'
import {db} from '../models'
import {Request, Response} from 'express'
import {GameModelDB} from '../models/game.model'
import {UserModelDB} from '../models/user.model'

const Game = db.game;

const createNewGameinDB = async (user: UserModelDB) => {
    try {
        const game = new Game({
          player0id: user._id,
          player1id: "0",
          gameasjson: newgame,
          status: "Open"
        });
        let saved = await game.save()
        await addNewGameToUser(user, game)
        return saved._id.toString()
    } catch (err) {
        return err
    }
  }

  const addNewGameToUser = async (user: UserModelDB, game: GameModelDB) => {
    user.open_games += 1 
    user.open_games_ids.push(game._id)
    user.save()    
  }

  const createNewGame = async (req : Request, res:Response, user:UserModelDB) => {
    let result = await createNewGameinDB(user)
    if (typeof result === "string") {
      res.send({ response: "New Game started, invite open." }).status(200);
      return
    } else {
      res.send({ response: result as string }).status(400);
      return
    }
}

const startGameInDB = async (game: GameModelDB, user: UserModelDB) => {
  game.time_started = new Date().toUTCString()
  game.last_change = new Date().toUTCString()
  game.status = "Playing"
  game.player1id = user._id  
  await game.save()
  user.open_games += 1 
  user.open_games_ids.push(game._id.toString())
  await user.save()    
}

const startGame = async (req: Request, res: Response, game: GameModelDB, user: UserModelDB) => {
    try {
      await startGameInDB(game, user)
        res.send({ response: "Joined New Game. Ready to play" }).status(200);
    } catch (err) {
        res.status(500).send({ message: err as string});
        return; 
    }
}

  export {createNewGame, startGame, createNewGameinDB, startGameInDB}
