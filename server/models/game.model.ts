import mongoose, {Schema, Document} from "mongoose";

interface GameModel {
  player0id?: string,
  player1id?: string,
  status?: string, 
  result?: string,
  time_started?: string,
  last_change?: string,
  unverified_move?: string,
  draw_proposed?: string,
  gameasjson?: string,
}

interface GameModelDB extends Document, GameModel {}

const GameSchema = new Schema<GameModel>({
  player0id: {type: String, required: true},
  player1id: String,
  status: {type: String, required: true}, 
  result: String,
  time_started: String,
  last_change: String,
  unverified_move: String,
  draw_proposed: String,
  gameasjson: String,

})

const Game = mongoose.model<GameModel>("Game", GameSchema);

export type { GameModel, GameModelDB}
export { Game }