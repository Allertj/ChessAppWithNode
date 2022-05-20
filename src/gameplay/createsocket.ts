import { server } from '../config'
import socketIOClient, {Socket} from "socket.io-client";

type Move = {color: number, x: number, y: number, destx: number, desty: number, gameid: string, sender: string}

interface GameId {gameid: string}
interface Sender {sender: string}
interface GameAsJson {gameasjson: string}

interface MSGInitiate extends GameId {}

interface MSGMove extends Move, GameId, Sender {}
interface MSGMoveVerified extends GameAsJson{ move: Move }                            
interface MSGConcede extends GameId, Sender{ color: number, }                        
interface MSGProposeDraw extends GameId, Sender {}
interface MSGDrawAccepted extends GameId, Sender, GameAsJson {}  
interface MSGDrawDeclined extends GameId, Sender {}                                 
interface MSGPromotion extends GameId{ piece: string, 
                                       x: number, 
                                       y: number, 
                                       player: number}
interface MSGDrawFinalized {result: string}   

const SendInitiation   = (socket: Socket, msg: MSGInitiate)     => { socket.emit("initiate", msg)}  
const SendMove         = (socket: Socket, msg: MSGMove)         => { socket.emit("move", msg)}                               
const SendConcession   = (socket: Socket, msg: MSGConcede)      => { socket.emit("concede", msg)}   
const SendProposeDraw  = (socket: Socket, msg: MSGProposeDraw)  => { socket.emit("propose_draw", msg)}                             
const SendDrawAccepted = (socket: Socket, msg: MSGDrawAccepted) => { socket.emit("draw_accepted", msg)} 
const SendDrawDeclined = (socket: Socket, msg: MSGDrawDeclined) => { socket.emit("draw_declined", msg)}                            
const SendMoveVerified = (socket: Socket, msg: MSGMoveVerified) => { socket.emit("move_verified", msg)}   
const SendPromotion    = (socket: Socket, msg: MSGPromotion)    => { socket.emit("promotion", msg)}   

const createSocket = (token: string, id: string) => {
    const ENDPOINT = `${server}`;
    const socket = socketIOClient(ENDPOINT, {
        auth: {
            token: token,
            id: id
        }})

    socket.on("connectaa", (msg) => {
      console.log("connected to socket:", msg)
    })

    socket.on("disconnect", () => {
      console.log("disconnected from socket:", socket.id); 
    });
    return socket
}


export type { Move, MSGPromotion, MSGProposeDraw, MSGDrawFinalized, 
              MSGConcede, MSGMoveVerified, MSGDrawDeclined, MSGDrawAccepted, MSGMove, MSGInitiate }
export { createSocket, SendInitiation, SendMove, SendConcession, 
         SendProposeDraw, SendDrawAccepted, SendDrawDeclined, SendMoveVerified, SendPromotion }   