// const mongoose = require("mongoose");
import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    id : String,
    stats : String,
    open_games: Number,
    total_games: Number,
    open_games_ids: [],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);
export { User }
// module.exports = User;
