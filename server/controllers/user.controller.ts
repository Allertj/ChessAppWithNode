import Express from 'express';

const allAccess = (req : Express.Request, res : Express.Response) => {
    res.status(200).send("Public Content.");
  };
const userBoard = (req : Express.Request, res : Express.Response) => {
    res.status(200).send("User Content.");
  };
const adminBoard = (req : Express.Request, res : Express.Response) => {
    res.status(200).send("Admin Content.");
  };
const moderatorBoard = (req : Express.Request, res : Express.Response) => {
    res.status(200).send("Moderator Content.");
  };

export { allAccess, userBoard, adminBoard, moderatorBoard }  