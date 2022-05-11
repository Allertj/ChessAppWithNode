const mongoose = require("mongoose");
const Game = mongoose.model(
  "Game",
  new mongoose.Schema({
    player0id: String,
    player1id: String,
    status: String, 
    result: String,
    time_started: String,
    time_ended: String,
    unverified_move: String,
    draw_proposed: String,
    gameasjson: String,
  })
);
module.exports = Game;
