import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs'
// import { DBADDRESS } from '../src/config' 
require('dotenv').config();

let app = express();
let server = http.createServer(app)
// add options to createServer to add certificate.
if (process.env.USE_SSL_IN_BACKEND === "true") {
  const privateKey = fs.readFileSync(process.env.SSL_KEY_FILE as string, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CRT_FILE as string, 'utf8');
  let options ={
    key: privateKey,
    cert: certificate
  }
  //@ts-expect-error  
  let server = http.createServer(options, app)
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    //@ts-expect-error  
app.options('*', cors())

//Add Routes
import {authRoutes} from './routes/auth.routes'
import {userRoutes} from './routes/user.routes'
import {chessRoutes} from './routes/chess.routes'

authRoutes(app)
userRoutes(app)
chessRoutes(app)

//Add Socket
import socketIOServer from "socket.io"
//@ts-expect-error
const io = socketIOServer(server, {cors: {origin: "*"}});
import {startSocket} from './socket/sockethandler'
startSocket(io)

// Start database
import {initial} from './initiatedb'
import {db} from './models'

db.mongoose
    .connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`, {
    //@ts-expect-error
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

server.listen(process.env.BACKEND_PORT, ()=>{
  console.log("Application running successfully on port: "+process.env.BACKEND_PORT);
});

