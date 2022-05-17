import { GameProfile } from "./gameprofile"

const ProfilePageHolder = (data: any) => {   
    let games = data.retrievedGames.map((game: any) => {
                return (<GameProfile key={game._id} 
                                     loadGame={data.loadGame}
                                     gameid={game._id} 
                                     result={game.result}
                                     opponent={(game.player1id === data.userdata.id ? game.player0id : game.player1id)} 
                                     status={game.status}/>)
                })

    let {W,D,L} = JSON.parse(data.userstats.stats)
    return (
       <div className="profile">
          <div className="statistics">  
          <div className="all-statistics-num">  
            <div className="statistic--num">{W}</div><div className="statistic--word">WINS&nbsp;</div>
            <div className="statistic--num">{D}</div><div className="statistic--word">DRAWS</div>
            <div className="statistic--num">{L}</div><div className="statistic--word">LOST&nbsp;</div>
            <div className="statistic--num">{data.userstats.open_games}</div>
             <div className="statistic--word">PLAYING</div></div>

             <div className="buttons--field">
             <div className="buttons--item">
                  <button onClick={data.setShowCurrent}>
                    {data.showCurrent ? "See past games" : "see current games"}</button>
              </div>
              <div className="buttons--item">
                  <button onClick={data.createNewGame}>Open/Join New Game</button>
              </div>
             </div>
          </div>
        {games}
      </div>)
}

export {ProfilePageHolder}