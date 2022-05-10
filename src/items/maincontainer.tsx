import React from 'react';
import { BoardContainer } from './boardcontainer'
import { Game } from '../chess/game'
import { XYString } from './board'
import socketIOClient from "socket.io-client";
import { replacer } from './helper';
import { server } from '../config'
import { status1 } from '../chess/misc'

const verifyMove = (data: any, game: any, socket: any) => {
    let msg = JSON.parse(data.gamedata.unverified_move)
    let {x, y, destx, desty, sender, color} = msg
    if (game.board[x][y] && sender === data.userdata.id) {
        game.makeMove(game.board, x, y, destx, desty, color)
        document.getElementById(XYString(destx, desty))?.click()         
    } else {
        let res = game.getPossibilities(color, x,  y).map(([x,y]: Array<number>)=> XYString(x,y))
        if (res.includes(XYString(destx, desty))) {
            game.makeMove(game.board, x, y, destx, desty, color)
            document.getElementById(XYString(destx, desty))?.click()
            let newmsg = {move: msg, 
                          gameasjson: JSON.stringify(game, replacer)}
                        //   token: data.userdate.accessToken}
            socket.emit("move verified", newmsg)
        }
    }    
}

// const ENDPOINT = `${server}`;
// const socket = socketIOClient(ENDPOINT, {
//     auth: {
//         token: "HELLO"
    // }
//   transportOptions: {
//     polling: {
//       extraHeaders: {
//         'Authorization': 'Bearer abc',
//       },
//     },
//   },
// });

// const ENDPOINT = `${server}`;
// const socket = socketIOClient(ENDPOINT, {
//     auth: {
//         token: data.userdata.accessToken
//     }})

// // socket.on("connectaaa", (msg) => {
// //     console.log("connected to socket:", msg)
// //   })
  
// //   socket.on("disconnect", () => {
// //     console.log("disconnected from socket:", socket.id); 
// //   });

const MainContainer = (data: any) => {   
        const game = Object.assign(new Game(), data.gamedata)
        // React.useEffect(() => {
        // console.log(game.movescount, "Movescount")
        // }, [])       
        const [drawproposed, setDrawProposed] = React.useState(() => {return false})
        React.useEffect(() => {
            if (data.gamedata.unverified_move) {
                verifyMove(data, game, data.socket)
             }
        }, [])            
        game.color = data.gamedata.color
        
        React.useEffect(() => {
            data.socket.emit("initiate", {id: game.id, token: data.userdata.accessToken})
            // data.socket.on("draw_finalised", (msg: any) => {
            //     // console.log("draw finalised", msg)
            // })
        }, [data.socket]);
        
        const socketSend = (data1: any) => {
            let o = {x:0, y:0, destx:0, desty:0, token:""}
            const obj = ([o.x, o.y, o.destx, o.desty, o.token] = data1.content, o)
            data.socket.emit("move", {...obj, gameid: game.id, 
                                         color: game.color, 
                                         sender: data.userdata.id,
                                         token: data.userdata.accessToken})
        }
        const concede = () => {
            game.concedeGame({gameid: game.id, 
                              color: game.color, 
                              sender: data.userdata.id})
            data.socket.emit("concede", {gameid: game.id, 
                                         color: game.color, 
                                         sender: data.userdata.id,
                                         token: data.userdata.accessToken})
        }
        const proposeDraw = () => {   
            // console.log("proposedraw fired")
            data.socket.emit("propose_draw", {id: game.id, sender: data.userdata.id, token: data.token})
    
        }
        const drawAnswer = (drawAnswer: boolean) => {
            setDrawProposed(false)
            if (drawAnswer) {         
                data.socket.emit("draw_accepted", {id: game.id, 
                                                   token: data.token, 
                                                   sender:data.userdata.id, 
                                                   gameasjson: JSON.stringify(game, replacer)})         
            } else {
                data.socket.emit("draw_declined", {id: game.id, token: data.token, sender:data.userdata.id})
            }
        }
        return (<BoardContainer game={game}
                                gameId={data.gameId} 
                                proposeDraw={proposeDraw}
                                drawAnswer={drawAnswer}
                                concede={concede}
                                drawproposed={drawproposed}
                                setDrawProposed={setDrawProposed}
                                socket={data.socket}
                                token={data.userdata.accessToken}
                                active={data.active} 
                                socketsend={socketSend}/>)

}

export { MainContainer }