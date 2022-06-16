import jwt from 'jsonwebtoken';
import {db} from "../models"
import {Request, Response, NextFunction} from 'express'

const User = db.user;
const Role = db.role;

declare global {
  namespace Express {
    interface Request {
      userId?: string
      headers: {"x-access-token"?: string}
    }
  }
}

const verifyToken = (req : Request, res : Response, next : NextFunction) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token as string, process.env.REACT_APP_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req : Request, res : Response, next : NextFunction) => {
    hasRole(req, res, next, "admin", "Require Admin Role");
}   

const isModerator = async (req : Request, res : Response, next : NextFunction) => {
  hasRole(req, res, next, "moderator", "Require Moderator Role");
}

const hasRole = async (req : Request, res : Response, next : NextFunction, role: string, message: string) => {
  try {
     let founduser = await User.findById(req.userId)
     let roles = await Role.find({ _id: { $in: founduser?.roles }})
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === role) {
          next();
          return;
        }
      }
      res.status(403).send({ message: message });
      return;
    } catch (err) {
      res.status(500).send({ message: err as string });
      return;
  }

};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

export { authJwt };

