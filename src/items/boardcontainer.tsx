import React from 'react';
import { Board , XYString, ReverseBoard } from './board';
import { SideBar } from './sidebar'
import { replacer } from './helper'
import { Popup } from './promotion'
import { ProposeDraw } from './proposedraw';

const BoardContainer = (gameid: any) => {
    const [board, setBoard] = React.useState(() => {return gameid.game.board})
    const [highlighted, setHighlighted] = React.useState(() => {return gameid.game.last_selected})
    const [options, setOptions] = React.useState(() => {return gameid.game.latest_poss_as_string})
    const [status, setStatus] = React.useState(() => {return gameid.game.status})
    const [moves, setMoves] = React.useState(() => {return gameid.game.getMoves()})

    const verifyMove = (msg: any) => {
        let res = gameid.game.getPossibilities(msg.color, msg.x, msg.y).map(([x,y]: Array<number>)=> XYString(x,y))
        if (res.includes(XYString(msg.destx, msg.desty))) {
            gameid.game.makeMove(gameid.game.board, msg.x, msg.y, msg.destx, msg.desty)
            document.getElementById(XYString(msg.destx, msg.desty))?.click()
            let newmsg = {move: msg, 
                          gameasjson: JSON.stringify(gameid.game, replacer),
                          token: gameid.token}
            gameid.socket.emit("move verified", newmsg)
        }
    }
    React.useEffect(() => {
        gameid.socket.on("othermove", (msg: any) => {
            // console.log(msg.gameid, gameid.game.id, gameid.active, "OTHERMOVE")
            verifyMove(msg)
        })
        gameid.socket.on("promotion_received",  (msg: any) => {
            let {x, y, player, piece} = msg
            gameid.game.promotePiece(x, y, player, piece) 
            setStatus("Playing")
        })
        gameid.socket.on("draw_proposed", (msg: any) => {
            gameid.setDrawProposed(true)
        })
        gameid.socket.on("draw_finalised", (msg: any) => {
            if (msg.result === "accepted") {
                setStatus("Draw")
                gameid.game.drawGame()
                // console.log("DRAW FINALISED FIRED", gameid.game)
            }
        })
        gameid.socket.on("other_player_has_conceded", (msg: any) => {
            setStatus("Other player has conceeded")
            gameid.game.concedeGame()
        })
    }, [gameid.socket])

    const askPromotePiece = (piece: any) => {
        gameid.socket.emit("promotion", {piece: piece, 
                                         token: gameid.token,
                                         gameid: gameid.game.id, 
                                         ...gameid.game.promotion})   
    }

    const updateFromBoard = ([x, y]: Array<any>) => {
        if (status === "Draw" || status === "Conceded" || status === "You have conceeded" || status === "Other player has conceeded") {return }
        if (!options.includes(XYString(x, y))) {
            gameid.game.getPossibilities(Number(gameid.game.color), x, y)
            
        } else {
            gameid.game.makeMove(gameid.game.board, highlighted[0],highlighted[1], x, y)
            gameid.socketsend({type: "move", content: [highlighted[0],highlighted[1], x, y], token: gameid.token})
        }       
        setBoard(gameid.game.board)
        setOptions(gameid.game.latest_poss_as_string)
        setHighlighted(gameid.game.last_selected)
        setStatus(gameid.game.status)
        setMoves(gameid.game.getMoves())
    }
    return <div className="flex-container"><SideBar moves={moves} 
                                                    concede={gameid.concede}
                                                    proposeDraw={gameid.proposeDraw}
                                                    setStatus={setStatus}
                                                    status={status}/> 
          <Popup openMenu={status === "Promotion" && gameid.game.promotion.player === gameid.game.color} 
                 askPromotePiece={askPromotePiece}/>  
          <ProposeDraw openMenu={gameid.drawproposed} drawAnswer={gameid.drawAnswer}/>                                               
        {gameid.game.color === 1 && <ReverseBoard board={board}
                                                  highlighted={highlighted}
                                                  options={options} 
                                                  status={status}
                                                  signalMove={updateFromBoard}/>}
        {gameid.game.color === 0 && <Board        board={board}
                                                  highlighted={highlighted}
                                                  options={options}
                                                  status={status} 
                                                  signalMove={updateFromBoard}/>}                                                
                                                  </div>
  }

export { BoardContainer } 