import jwt from 'jsonwebtoken';
import {db} from "../models"
import Express from 'express'

const User = db.user;
const Role = db.role;

const verifyToken = (req : any, res : any, next : any) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.REACT_APP_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req : any, res : Express.Response, next : ()=>{}) => {
    hasRole(req, res, next, "admin", "Require Admin Role");
}   

const isModerator = async (req : any, res : Express.Response, next : ()=>{}) => {
  hasRole(req, res, next, "moderator", "Require Moderator Role");
}

const hasRole = async (req : any, res : Express.Response, next : ()=>{}, role: String, message: string) => {
  try {
     let founduser = await User.findById(req.userId)
     let roles = await Role.find({ _id: { $in: founduser.roles }})
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === role) {
          next();
          return;
        }
      }
      res.status(403).send({ message: message });
      return;
    } catch (err) {
      res.status(500).send({ message: err });
      return;
  }

};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

export { authJwt };

