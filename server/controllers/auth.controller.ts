import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../models'
import { Schema} from "mongoose";
import { Response, Request} from "express"
import {RoleModel} from "../models/role.model"

const User = db.user;
const Role = db.role;

const createUser = async (username: string, email: string, password: string, reqroles: any) => {
  const user = new User({
    username: username,
    email: email,
    open_games: 0,
    password: bcrypt.hashSync(password as string, 8)
  });
      await user.save()
      if (reqroles) {
         let roles = await Role.find({ name: { $in: reqroles }})
         let result = roles.map((role : RoleModel) => role._id);
         user.roles = result as [{ type: Schema.Types.ObjectId; ref: "Role", name: string}]
         return await user.save()
      } else {
        let role = await Role.findOne({ name: "user" })
        if (role) { 
        user.roles = [role._id];   
        return await user.save()    
      }
      } 
}


const signup = async (req : Request, res : Response) => {
  try {
    await createUser(req.body.username, req.body.email, req.body.password, req.body.roles)
    res.send({ status: 200, message: "User was registered successfully!" });
  } catch (err) {
     res.status(500).send({ message: err as string });
  }
}

const signin = (req : Request, res : Response) => {
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
      const authorities : any[] = [];

      if (user.roles) {
      for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_"  + user.roles[i].name.toUpperCase());
      }
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

export { signup, signin, createUser}