import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../models'
import Express from 'express'
import mongoose from "mongoose";
import { Document} from "mongoose";

const User = db.user;
const Role = db.role;

interface DBRole extends Document {
  name: String
}

const signup = async (req : Express.Request, res : Express.Response) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    open_games: 0,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  try {
      await user.save()
      if (req.body.roles) {
         let roles = await Role.find({ name: { $in: req.body.roles }})
         user.roles = roles.map((role : DBRole)=> role._id);
         await user.save()
         res.send({ message: "User was registered successfully!" });
      } else {
        let role = await Role.findOne({ name: "user" }) 
        user.roles = [role._id];   
        await user.save()    
        res.send({ message: "User was registered successfully!" });
      } 
  } catch (err) {
      res.status(500).send({ message: err });
      return;
  }
};
const signin = (req : Express.Request, res : Express.Response) => {
  User.findOne({
    username: req.body.username
  }).populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      const token = jwt.sign({ id: user.id }, process.env.REACT_APP_SECRET as string, {
        expiresIn: 86400 // 24 hours
      });
      const authorities = [];
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