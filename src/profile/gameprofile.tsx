interface GameProfileArgs {gameid: string, 
                           status: string, 
                           result: string,
                           opponent: string, 
                           loadGame: (data: string) => void}

const parseResult = (result: string, opponent: string) => {
    let res = JSON.parse(result);
    if (res.draw) return "Draw"
    if (res.loser) {return res.loser  !== opponent ? `Lost by ${res.by}` : `Won by ${res.by}`}
    if (res.winner) {return res.winner !== opponent ? `Won by ${res.by}` : `Lost by ${res.by}`}
}

const GameProfile = ({ gameid, status, opponent, result, loadGame }: GameProfileArgs) => {
    const chooseGame = () => {
        loadGame(gameid)
    }
    let gameopen = (status === "Ended" || status === "Open")    
    return (<div className="game">
              <div className="stat">GAME {gameid.slice(-10)}</div>
              <div className="stat">Played Against : {opponent.slice(-10)}</div>
              <div className="stat">Status : {status}</div>
              {!gameopen && <div className="button"><button onClick={chooseGame}>Resume</button></div>}
              {status === "Ended" && <div className="stat"> {parseResult(result, opponent)}</div>}
            </div>)
  }
  
export { GameProfile }
