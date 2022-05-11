const db = require("./models");
// const Role = db.role;
const Game = db.game;
// const User = db.user;

const jwt = require("jsonwebtoken");
const config = require("./config/auth.config.js");
const User = require("./models/user.model");

const editGame = (id, obj) => {
    Game.findOne({
        _id: id
      }).exec((err, game) => {
      if (err) {  
            return;  }
      if (game) {
        Object.keys(obj).map(key =>{
            game[key] = obj[key]
        })
        game.save()
      }}) 
}


const AddStatToUser = (userid, stat) => {
    User.findOne({_id: userid})
      .exec((err, user) => {
        let originalstat = JSON.parse(user.stats)
        originalstat[stat] += 1
        user.stats = JSON.stringify(originalstat)
        user.open_games -= 1
        user.save()
      })
} 

const getOtherPlayer = (game, player) => {
    if (player === game.player0id) {return game.player1id}
    else {return game.player0id}
}

const addStatistics = (gameid, draw, winner, loser) => {
    Game.findOne({
        _id: gameid
     }).exec((err, game) => {
        if (draw) {
            AddStatToUser(game.player1id, "D")
            AddStatToUser(game.player0id, "D")
        }
        if (winner) {
          AddStatToUser(winner, "W")
          AddStatToUser(getOtherPlayer(game, winner), "L")
        }
        if (loser) {
          AddStatToUser(loser, "L")
          AddStatToUser(getOtherPlayer(game, loser), "W")
        }
     })

}

exports = module.exports = function(io){
    io.use((socket, next) => {
        jwt.verify(socket.handshake.auth.token, config.secret, (err, decoded) => {
          if (decoded) { 
            next()
          }
        });
      });
    io.on('connection', client => {
        client.on("initiate", (msg) => {
            client.join(msg.id)
            io.to(msg.id).emit("connectaaa", `connected to ${msg.id}`);
        });
        client.on("move", (msg) => {
            // console.log("move")
            editGame(msg.gameid, {unverified_move: JSON.stringify(msg)})
            client.broadcast.to(msg.gameid).emit("othermove", msg)
        });
        client.on("promotion", (msg) => {
            io.to(msg.id).emit("promotion_received", msg)
        });
        client.on("propose_draw", (msg) => {
            editGame(msg.gameid, {draw_proposed: JSON.stringify({sender: msg.sender})})
            client.broadcast.to(msg.gameid).emit("draw_proposed", msg)
        });
        client.on("draw_accepted", (msg) => {
          let gameasjson1 = JSON.parse(msg.gameasjson)
          gameasjson1.status = "Draw"
          editGame(msg.gameid, {result: JSON.stringify({draw: true, by: "Proposal", notes: `accepted by ${msg.sender}`}), 
                            status: "Ended", 
                            gameasjson: JSON.stringify(gameasjson1),
                            draw_proposed: ""})
          addStatistics(msg.gameid, true)                  
          // io.to(msg.id).emit("connectaaa", `connected to ${msg.id}`);                  
          io.to(msg.gameid).emit("draw_finalised", {result: "accepted"})
        })
        client.on("draw_declined", (msg) => {
          editGame(msg.gameid, {draw_proposed: ""})
          client.broadcast.to(msg.gameid).emit("draw_finalised", {result: "declined"})
        })
        client.on("concede", (msg) => {
          editGame(msg.gameid, {result: JSON.stringify({draw: false, loser: msg.sender, by: "Concession"}), status: "Ended"})
          // data.socket.emit("concede", {id: data.game.id, token: data.token})
          addStatistics(msg.gameid, null, null, msg.sender)   
          client.broadcast.to(msg.gameid).emit("other_player_has_conceded", msg)
        });    
        client.on("move verified", (msg) => { 
          let curgame  = JSON.parse(msg.gameasjson)
          if (curgame.status === "Checkmate") {
              editGame(msg.move.gameid, {result: JSON.stringify({draw: false, winner: msg.move.sender, by: "Checkmate"}), status: "Ended"})
              addStatistics(msg.gameid, null, msg.move.sender, null) 
              return;
          }
          if (curgame.status === "Stalemate") {
            editGame(msg.move.gameid, {result: JSON.stringify({draw: true, by: "Stalemate"}), status: "Stalemate"})
            addStatistics(msg.gameid, true) 
            return;
        }
            Game.findOne({
                _id: msg.move.gameid
              }).exec((err, game) => {
                  if (game.unverified_move && JSON.stringify(msg.move) === game.unverified_move) {   
                    editGame(msg.move.gameid, {gameasjson: msg.gameasjson, unverified_move: ""})
                  }
              })
        });
    });
  }