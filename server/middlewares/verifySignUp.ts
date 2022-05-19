import { db } from '../models'
import {Request, Response, NextFunction} from 'express'

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsername = async (req : Request, res : Response, next: NextFunction) => {
  try {
      let user = await User.findOne({ username: req.body.username})
      if (user) {
          res.status(400).send({ message: "Failed! Username is already in use!" });
          return;
      }
      next();
  } catch (err) {
      res.status(500).send({ message: err });
      return;
  }
}
const checkDuplicateEmail  = async (req : Request, res : Response, next: NextFunction) => {  
  try {
    let email = await User.findOne({ email: req.body.email })
    if (email) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
    next();
  } catch (err) {
       res.status(500).send({ message: err });
       return;
  }
}

const checkRolesExisted = (req : Request, res : Response, next : NextFunction) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

export { checkDuplicateUsername, checkDuplicateEmail, checkRolesExisted }