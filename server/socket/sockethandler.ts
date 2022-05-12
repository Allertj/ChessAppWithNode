import  Jwt  from 'jsonwebtoken'
import { config } from "../../src/config"
import { addStatistics, editGame } from '../controllers/gamestats.controller';
import { db } from "../models"

const Game = db.game;

interface GameModel {
  player0id: String,
  player1id: String,
  status: String, 
  result: String,
  time_started: String,
  time_ended: String,
  unverified_move: String,
  draw_proposed: String,
  gameasjson: String,
}

interface SocketMessage {
  gameid: String,
  sender: String
}

interface SocketMessageBoard {
  gameid: String,
  sender: String,
  gameasjson: string
  move: any
}

function startSocket(io: any){
    io.use((socket : any, next: () => void) => {
        Jwt.verify(socket.handshake.auth.token, config.secret, (err: any, decoded: any) => {
          if (decoded) { 
            next()
          }
        });
      });
    io.on('connection', (client: any) => {
        client.on("initiate", (msg: SocketMessage) => {
            client.join(msg.gameid)
            io.to(msg.gameid).emit("connectaaa", `connected to ${msg.gameid}`);
        });

        client.on("move", (msg: SocketMessage) => {
            editGame(msg.gameid, {unverified_move: JSON.stringify(msg)})
            client.broadcast.to(msg.gameid).emit("othermove", msg)
        });
        
        client.on("promotion", (msg: SocketMessage) => {
            io.to(msg.gameid).emit("promotion_received", msg)
        });
        
        client.on("propose_draw", (msg: SocketMessage) => {
            editGame(msg.gameid, {draw_proposed: JSON.stringify({sender: msg.sender})})
            client.broadcast.to(msg.gameid).emit("draw_proposed", msg)
        });
        
        client.on("draw_accepted", (msg: SocketMessageBoard) => {
          let gameasjson1 = JSON.parse(msg.gameasjson)
          gameasjson1.status = "Draw"
          editGame(msg.gameid, {result: JSON.stringify({draw: true, by: "Proposal", notes: `accepted by ${msg.sender}`}), 
                            status: "Ended", 
                            gameasjson: JSON.stringify(gameasjson1),
                            draw_proposed: ""})
          addStatistics(msg.gameid, true, null, null)                                  
          io.to(msg.gameid).emit("draw_finalised", {result: "accepted"})
        })
        
        client.on("draw_declined", (msg: SocketMessage) => {
          editGame(msg.gameid, {draw_proposed: ""})
          client.broadcast.to(msg.gameid).emit("draw_finalised", {result: "declined"})
        })
        
        client.on("concede", (msg: SocketMessage) => {
          editGame(msg.gameid, {result: JSON.stringify({draw: false, loser: msg.sender, by: "Concession"}), status: "Ended"})
          addStatistics(msg.gameid, false, null, msg.sender)   
          client.broadcast.to(msg.gameid).emit("other_player_has_conceded", msg)
        });    
        
        client.on("move verified", (msg: SocketMessageBoard) => { 
          let curgame  = JSON.parse(msg.gameasjson)
          if (curgame.status === "Checkmate") {
              editGame(msg.move.gameid, {result: JSON.stringify({draw: false, winner: msg.move.sender, by: "Checkmate"}), status: "Ended"})
              addStatistics(msg.gameid, false, msg.move.sender, null) 
              return;
          }
          if (curgame.status === "Stalemate") {
            editGame(msg.move.gameid, {result: JSON.stringify({draw: true, by: "Stalemate"}), status: "Stalemate"})
            addStatistics(msg.gameid, true, null,  null) 
            return;
        }
          Game.findOne({
                _id: msg.move.gameid
              }).exec((err: any, game: GameModel) => {
                  if (game.unverified_move && JSON.stringify(msg.move) === game.unverified_move) {   
                    editGame(msg.move.gameid, {gameasjson: msg.gameasjson, unverified_move: ""})
                  }
              })
        });
    });
  }

  export {startSocket}