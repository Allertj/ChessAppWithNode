interface GameProfileArgs {gameid: string, 
                           status: string, 
                           result: string,
                           last_change: string,
                           opponent: string, 
                           loadGame: (data: string) => void}

const parseResult = (result: string, opponent: string) => {
    let res = JSON.parse(result);
    if (res.draw) return "Draw"
    if (res.loser) {return res.loser  !== opponent ? `Lost by ${res.by}` : `Won by ${res.by}`}
    if (res.winner) {return res.winner !== opponent ? `Won by ${res.by}` : `Lost by ${res.by}`}
}

const getStatus = (status: string, callback: () => void) => {
    switch (status) {
        case "Open": return <div></div>
        case "Ended": return <button onClick={callback}>View</button>
        default: return <button onClick={callback}>Resume</button>
    }
}

const GameProfile = ({ gameid, status, opponent, result, loadGame }: GameProfileArgs) => {
    const chooseGame = () => {
        loadGame(gameid)
    } 
    return (<div className="game">
              <div className="stat">GAME {gameid.slice(-10)}</div>
              <div className="stat">Played Against : {opponent.slice(-10)}</div>
              <div className="stat">Status : {status}</div>
              {status === "Ended" && <div className="stat"> {parseResult(result, opponent)}</div>}
              <div className="button">{getStatus(status, chooseGame)}</div>
            </div>)
  }
  
export { GameProfile }
