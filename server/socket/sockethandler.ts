import  Jwt  from 'jsonwebtoken'
import { addStatistics, editGame } from '../controllers/gamestats.controller';
import { db } from "../models"
import { Move, MSGPromotion, MSGProposeDraw,  MSGConcede, 
        MSGMoveVerified, MSGDrawDeclined, MSGDrawAccepted, 
        MSGMove, MSGInitiate } from '../../src/gameplay/createsocket'
import {Server, Socket} from 'socket.io'

const Game = db.game;

function startSocket(io: Server) {
    io.use((socket : Socket, next: () => void) => {
        Jwt.verify(socket.handshake.auth.token, process.env.REACT_APP_SECRET as string, (err: any, decoded: any) => {
          if (decoded) { 
            next()
          }
        });
      });
    io.on('connection', (client: Socket) => {
        client.on("initiate", (msg: MSGInitiate) => {
            client.join(msg.gameid)
            io.to(msg.gameid).emit("connectaaa", `connected to ${msg.gameid}`);
        });

        client.on("move", (msg: MSGMove) => {
            editGame(msg.gameid, {unverified_move: JSON.stringify(msg)})
            client.broadcast.to(msg.gameid).emit("othermove", msg)
        });
        
        client.on("promotion", (msg: MSGPromotion) => {
            io.to(msg.gameid).emit("promotion_received", msg)
        });
        
        client.on("propose_draw", (msg: MSGProposeDraw) => {
            editGame(msg.gameid, {draw_proposed: JSON.stringify({sender: msg.sender})})
            client.broadcast.to(msg.gameid).emit("draw_proposed", msg)
        });
        
        client.on("draw_accepted", (msg: MSGDrawAccepted) => {
          let gameasjson1 = JSON.parse(msg.gameasjson)
          gameasjson1.status = "Draw"
          editGame(msg.gameid, {result: JSON.stringify({draw: true, by: "Proposal", notes: `accepted by ${msg.sender}`}), 
                            status: "Ended", 
                            gameasjson: JSON.stringify(gameasjson1),
                            draw_proposed: ""})
          addStatistics(msg.gameid, true, null, null)                                  
          io.to(msg.gameid).emit("draw_finalised", {result: "accepted"})
        })
        
        client.on("draw_declined", (msg: MSGDrawDeclined) => {
          editGame(msg.gameid, {draw_proposed: ""})
          client.broadcast.to(msg.gameid).emit("draw_finalised", {result: "declined"})
        })
        
        client.on("concede", (msg: MSGConcede) => {
          editGame(msg.gameid, {result: JSON.stringify({draw: false, loser: msg.sender, by: "Concession"}), status: "Ended"})
          addStatistics(msg.gameid, false, null, msg.sender)   
          client.broadcast.to(msg.gameid).emit("other_player_has_conceded", msg)
        });    
        
        client.on("move_verified", (msg: MSGMoveVerified) => { 
          let curgame  = JSON.parse(msg.gameasjson)
          if (curgame.status === "Checkmate") {
              editGame(msg.move.gameid, {result: JSON.stringify({draw: false, winner: msg.move.sender, by: "Checkmate"}), status: "Ended"})
              addStatistics(msg.move.gameid, false, msg.move.sender, null) 
              return;
          }
          if (curgame.status === "Stalemate") {
            editGame(msg.move.gameid, {result: JSON.stringify({draw: true, by: "Stalemate"}), status: "Stalemate"})
            addStatistics(msg.move.gameid, true, null,  null) 
            return;
        }
          Game.findOne({ _id: msg.move.gameid
              }).exec((err: any, game: any) => {
                  if (game.unverified_move && JSON.stringify(msg.move) === game.unverified_move) {   
                    editGame(msg.move.gameid, {gameasjson: msg.gameasjson, unverified_move: ""})
                  }
              })
        });
    });
  }

  export {startSocket}