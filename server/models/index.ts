import mongoose from "mongoose";
import {Game} from './game.model'
import {Role} from './role.model'
import {User} from './user.model'

mongoose.Promise = global.Promise;

const db = {mongoose : mongoose, game: Game, user: User, role: Role, ROLES: ["user", "admin"]};

export { db }

