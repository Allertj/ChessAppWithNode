import express from 'express';
import cors from 'cors';
import http from 'http';
import { dbConfig, PORT, DBADDRESS } from '../src/config' 

let app = express();
let server = http.createServer(app)
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
    .connect(DBADDRESS, {
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

server.listen(PORT, ()=>{
  console.log("Application running successfully on port: "+PORT);
});

