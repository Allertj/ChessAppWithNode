import { makeGETRequest, makeGETRequestAuth} from './requests'
import { reviver } from "./helper"
import { server } from '../config'
import { Link, useNavigate } from "react-router-dom";

const GameProfile = (data1: any) => {
    let navigate = useNavigate();
    const loadGame = (data: any) => {
        let gamedata = JSON.parse(data.gameasjson, reviver)        
        gamedata.color = data1.color
        gamedata.id = data1.number
        gamedata.unverified_move = data1.unverified_move
        data1.handlechoice1(gamedata)
        navigate("/game", { replace: true });

    }
    const startGame = () => {
        makeGETRequestAuth(`${server}/requestgamedata/${data1.number}`, loadGame, "", data1.userdata.accessToken) 
        // makeGETRequest(`${server}/requestgamedata/${data1.number}`, loadGame)
    }   
    
    return (<div className="game">
              <div>GAME {data1.number.slice(-10)}</div>
              <div className="stat">Played Against : {data1.opponent}</div>
              <div className="stat">Status : {data1.status}</div>
              {(data1.status !== "Open") && <div className="button"><button onClick={startGame}>Resume</button></div>}
            </div>)
  }
  
export { GameProfile }
