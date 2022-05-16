import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../models'
import Express from 'express'
import mongoose from "mongoose";
import { Document} from "mongoose";

const User = db.user;
const Role = db.role;
// const Game = db.game;

interface DBRole extends Document {
  name: String
}
interface DBUser extends Document{
  username: String,
  email: String,
  password: String,
  id : String,
  stats : String,
  open_games: Number,
  open_games_ids: [],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
}

const signup = (req : Express.Request, res : Express.Response) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    open_games: 0,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save((err: any, user: DBUser) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find({ name: { $in: req.body.roles }}, (err : any, roles: any) => {
        if (err) {
           res.status(500).send({ message: err });
           return;
        }
        user.roles = roles.map((role : DBRole)=> role._id);
        user.save((err: any) => {
          if (err) {
             res.status(500).send({ message: err });
             return;
        }
          res.send({ message: "User was registered successfully!" });
        });});
    } else {
      Role.findOne({ name: "user" }, (err: any, role: DBRole) => {
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
const signin = (req : Express.Request, res : Express.Response) => {
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
      var token = jwt.sign({ id: user.id }, process.env.REACT_APP_SECRET as string, {
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
        open_games: user.open_games,
        roles: authorities,
        accessToken: token
      });
    });
};



export { signup, signin}