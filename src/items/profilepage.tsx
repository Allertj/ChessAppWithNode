import React from 'react';
import { makePOSTRequestAuth } from './requests'
import { GameProfile } from './gameprofile'
import { server } from '../config'

  const ProfilePage = (data: any) => {
      const callFor = (game: any) => {
          makePOSTRequestAuth(`${server}/newgame`, data.userdata, data.checkForGames, "", data.userdata.accessToken)
      }
      const games = data.retrievedGames.map((game: any) => {
                    return (<GameProfile key={game._id} 
                              number={game._id} 
                              color={(game.player1id === data.userdata.id ? 1 : 0)}
                              opponent={(game.player1id === data.userdata.id ? game.player0id.slice(-10) : game.player1id.slice(-10))} 
                              status={game.status}
                              userdata={data.userdata}
                              gamedata={game.gameasjson}
                              draw_proposed={game.draw_proposed}
                              unverified_move={game.unverified_move}
                              handlechoice1={data.handlechoice}/>)
      })               
      
      // let {W,D,L} = JSON.parse(data.userdata.stats)
      
      return (<div className="profile">
                  <div className="game">
                       <div className="statistic--num">{1}</div><div className="statistic--word">WINS&nbsp;</div>
                       <div className="statistic--num">{2}</div><div className="statistic--word">DRAWS</div>
                       <div className="statistic--num">{2}</div><div className="statistic--word">LOST&nbsp;</div>
                       <div className="statistic--num">{data.userdata.open_games}</div><div className="statistic--word">PLAYING</div>
                       <div className="button">
               <button onClick={callFor}>New Game</button>
              </div></div>
                {games}
              </div>)
  }

  export { ProfilePage }