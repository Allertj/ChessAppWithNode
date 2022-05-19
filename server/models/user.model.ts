import mongoose, {Schema, Document} from "mongoose";

interface UserModel {
  username: string,
  email: string,
  password: string,
  stats : string,
  open_games: number,
  open_games_ids: Array<string>,
  roles: [
    { 
      name: string
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
}
const UserSchema = new Schema<UserModel>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    stats : {type: String, default: `{"W":0, "D":0, "L":0}`},
    open_games: Number,
    open_games_ids: [],
    roles: [
      { 
        name: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]  
})

const User = mongoose.model<UserModel>("User", UserSchema);
interface UserModelDB extends Document, UserModel {}

export type {UserModel, UserModelDB}
export { User }