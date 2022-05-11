const config = require("../config/auth.config");

const crypto = require("crypto");
const startgame = require('./standardgame.ts')

const db = require("../models");
const User = db.user;
const Role = db.role;
const Game = require("../models/game.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    open_games: 0,
    total_games: 0,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find({ name: { $in: req.body.roles }}, (err, roles) => {
        if (err) {
           res.status(500).send({ message: err });
           return;
        }
        user.roles = roles.map(role => role._id);
        user.save(err => {
          if (err) {
             res.status(500).send({ message: err });
             return;
        }
          res.send({ message: "User was registered successfully!" });
        });});
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
const signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        stats: user.stats,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

// const retrieveGameFromDb = (req, res) => {
//   Game.findOne({
//     gameid: req.body.gameid
//   }).exec((err, gameid) => {
//   if (err) {
//     res.status(500).send({ message: err });
//     return;
//   }
//   if (!gameid) {
//     return res.status(404).send({ message: "game not found." });
//   }
//   if (gameid) {
//     return res.status(200).send({
//       gameid: gameid._id,
//       player1id: gameid.player1id,
//       player0id: gameid.player0id,
//       status: gameid.status,
//       gameasjson: gameid.gameasjson,
//     })}
//   });
// }

const createNewGame = (player0id, callback) => {
  const id = crypto.randomBytes(16).toString("hex");
  const game = new Game({
    gameid: id,
    player0id: player0id,
    player1id: "0",
    gameasjson: startgame.game,
    status: "Open"
  });
  game.save(callback)

}

exports.createNewGame = createNewGame;
exports.signup = signup;
exports.signin = signin;