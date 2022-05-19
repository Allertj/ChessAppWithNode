import { checkDuplicateUsername, checkDuplicateEmail, checkRolesExisted } from "../middlewares/verifySignUp";
import { signup, signin } from "../controllers/auth.controller";
import {Request, Response, NextFunction, Application} from 'express';

const authRoutes = (app: Application) => {
  app.use(function(req : Request, res : Response, next : NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
   });
  app.post("/api/auth/signup",
    [
      checkDuplicateUsername,
      checkDuplicateEmail,
      checkRolesExisted
    ],
    signup
  );
  app.post("/api/auth/signin", signin);
};

export {authRoutes}