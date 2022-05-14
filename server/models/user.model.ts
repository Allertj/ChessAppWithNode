import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    stats : {type: String, default: `{"W":0, "D":0, "L":0}`},
    open_games: Number,
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