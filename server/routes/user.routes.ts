import { authJwt } from "../middlewares/authJwt"
import {allAccess, userBoard, adminBoard, moderatorBoard} from "../controllers/user.controller"
import Express from 'express';

const userRoutes = (app: any) => {
  app.use(function(req : Express.Request, res : Express.Response, next : ()=>{}) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/test/all", allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], userBoard);
  
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    moderatorBoard
  );
  
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    adminBoard
  );
};

export {userRoutes}