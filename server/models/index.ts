// const mongoose = require('mongoose');
import mongoose from "mongoose";
import {Game} from './game.model'
import {Role} from './role.model'
import {User} from './user.model'
mongoose.Promise = global.Promise;


const db = {mongoose : mongoose, game: Game, user: User, role: Role, ROLES: ["user", "admin"]};

// db.mongoose = mongoose;
// db.user = require("./user.model");
// db.role = require("./role.model");

// db.game = Game
// db.user = User
// db.role = Role
// db.game = require("./game.model");
// db.ROLES = ["user", "admin"];

export { db }
// module.exports = db;
