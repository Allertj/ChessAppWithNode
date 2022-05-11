import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignUp";
import { signup, signin } from "../controllers/auth.controller";
import Express from 'express';

const authRoutes = (app: any) => {
  app.use(function(req : Express.Request, res : Express.Response, next : ()=>{}) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
   });
  app.post("/api/auth/signup",
    [
      checkDuplicateUsernameOrEmail,
      checkRolesExisted
    ],
    signup
  );
  app.post("/api/auth/signin", signin);
};

export {authRoutes}