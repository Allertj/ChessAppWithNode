import {db} from "../models"
import {GameModel, GameModelDB } from '../models/game.model'

enum Stat {W = "W", D = "D", L = "L"}

const Game = db.game;
const User = db.user;

const runFunctionOnGame = async (id:string, func: (game: any) => void) => {
  try {
    let game = await Game.findOne({ _id: id  })
    if (game) {
      func(game)
    }
  } catch (err) {
      return;
  }  
}

const editGame = async (id: String, obj: GameModel) => {
  try {
    await Game.findOneAndUpdate({ _id: id}, obj)
  } catch (err) {
    return;
  }
}
  
  const AddStatToUser = async (userid: string, stat: Stat, gameid: String) => {
      try {
          let user = await User.findOne({_id: userid})
          if (user) {
          let originalstat = JSON.parse(user.stats)
          originalstat[stat] += 1
          user.stats = JSON.stringify(originalstat)
          user.open_games -= 1
          user.open_games_ids = user.open_games_ids.filter((number: String) => { return number !== gameid;});          
          user.save()
          }
      } catch (err) {
         console.log("ERROR", err)
      }
  } 
  
  const getOtherPlayer = (game: GameModelDB, player: String) : string => {
      if (player === game.player0id) {return game.player1id as string}
      else {return game.player0id as string}
  }
  
  const endGame = async (game: GameModelDB) => {
    if (game.gameasjson) {
    let data = JSON.parse(game.gameasjson)
    data.status = "Ended"
    game.toObject();
    delete game.draw_proposed
    game.last_change = new Date().toUTCString()
    game.gameasjson = JSON.stringify(data)
    await game.save()
    }
  }

  const addStatistics = async (gameid: String, draw: boolean, winner: string | null, loser: string | null) => {
    try {
      let game = await Game.findOne({ _id: gameid  })
      if (game) {
          endGame(game)
          if (draw && game.player1id && game.player0id) {
            AddStatToUser(game.player1id, Stat.D, gameid)
            AddStatToUser(game.player0id, Stat.D, gameid)
          }
          if (winner) {
            AddStatToUser(winner, Stat.W, gameid)
            AddStatToUser(getOtherPlayer(game, winner), Stat.L, gameid)
          }
          if (loser) {
            AddStatToUser(loser, Stat.L, gameid)
            AddStatToUser(getOtherPlayer(game, loser), Stat.W, gameid)
          }
      }
    } catch (err) {
      console.log("ERROR:", err)
    }
  }

  export {editGame, addStatistics, runFunctionOnGame, endGame}