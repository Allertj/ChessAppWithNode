import {db} from "../models"

const Game = db.game;
const User = db.user;

interface GameModel {
  player0id: String,
  player1id: String,
  status: String, 
  result: String,
  time_started: String,
  time_ended: String,
  unverified_move: String,
  draw_proposed: String,
  gameasjson: String,
}

const editGame = async (id: String, obj: any) => {
    try {
      let game = await Game.findOne({ _id: id  })
      if (game) { 
        Object.keys(obj).map((key: string) => {
          game[key] = obj[key]
        })
        game.save()
      }
    } catch (err) {
        return;
    }
  }
  
  const AddStatToUser = (userid: String, stat: any, gameid: String) => {
      User.findOne({_id: userid})
        .exec((err, user) => {
          let originalstat = JSON.parse(user.stats)
          originalstat[stat] += 1
          user.stats = JSON.stringify(originalstat)
          user.open_games -= 1
          user.open_games_ids = user.open_games_ids.filter((number: String) => { return number !== gameid;});          
          user.save()
        })
  } 
  
  const getOtherPlayer = (game: GameModel, player: String) => {
      if (player === game.player0id) {return game.player1id}
      else {return game.player0id}
  }
  
  const addStatistics = (gameid: String, draw: boolean, winner: String | null, loser: String | null) => {
    // console.log("addstatiscsstart", winner, gameid)
    Game.findOne({
          _id: gameid
       }).exec((err: any, game: any) => {
         game.toObject();
         delete game.unverified_move
         delete game.draw_proposed
         game.time_ended = new Date().toUTCString()
          if (draw) {
              AddStatToUser(game.player1id, "D", gameid)
              AddStatToUser(game.player0id, "D", gameid)
          }
          if (winner) {
            AddStatToUser(winner, "W", gameid)
            AddStatToUser(getOtherPlayer(game, winner), "L", gameid)
          }
          if (loser) {
            AddStatToUser(loser, "L", gameid)
            AddStatToUser(getOtherPlayer(game, loser), "W", gameid)
          }
       })
  
  }

  export {editGame, addStatistics}