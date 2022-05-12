import React from 'react';
import { BoardContainer } from './boardcontainer'
import { Game } from '../chess/game'
import { XYString } from './board'
import { replacer } from './helper';
import { createSocket } from './createsocket';

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
            socket.emit("move verified", newmsg)
        }
    }    
}

const MainContainer = (data: any) => {      
        const [drawproposed, setDrawProposed] = React.useState(() => {return false})
        const game = Object.assign(new Game(), data.gamedata)
        let socket = React.useRef(createSocket(data.userdata.accessToken, data.userdata.id))
        React.useEffect(() => {
            if (data.gamedata.unverified_move) {
                verifyMove(data, game, data.socket)
             }
             if (data.gamedata.draw_proposed && JSON.parse(data.gamedata.draw_proposed).sender !== data.userdata.id) {
                setDrawProposed(true)
            } 
        }, [data, game])                  
        React.useEffect(() => {           
            socket.current.emit("initiate", {gameid: game.id})
        }, [game.id]);
        
        const socketSend = (data1: any) => {
            let o = {x:0, y:0, destx:0, desty:0, token:""}
            const obj = ([o.x, o.y, o.destx, o.desty, o.token] = data1.content, o)
            socket.current.emit("move", {...obj, 
                                      gameid: game.id, 
                                      color: game.color, 
                                      sender: data.userdata.id})
        }
        const concede = () => {
            game.concedeGame({gameid: game.id, 
                              color: game.color, 
                              sender: data.userdata.id})
            socket.current.emit("concede", {gameid: game.id, 
                                         color: game.color, 
                                         sender: data.userdata.id})
        }
        const proposeDraw = () => {   
            socket.current.emit("propose_draw", {gameid: game.id, 
                                              sender: data.userdata.id})
    
        }
        const drawAnswer = (drawAnswer: boolean) => {
            setDrawProposed(false)
            if (drawAnswer) {         
                socket.current.emit("draw_accepted", {gameid: game.id, 
                                                   sender:data.userdata.id, 
                                                   gameasjson: JSON.stringify(game, replacer)})         
            } else {
                socket.current.emit("draw_declined", {gameid: game.id, 
                                                   sender:data.userdata.id})
            }
        }
        return (<BoardContainer game={game}
                                gameId={data.gameId} 
                                proposeDraw={proposeDraw}
                                drawAnswer={drawAnswer}
                                concede={concede}
                                drawproposed={drawproposed}
                                setDrawProposed={setDrawProposed}
                                socket={socket.current}
                                token={data.userdata.accessToken}
                                // active={data.active} 
                                socketsend={socketSend}/>)
}

export { MainContainer }