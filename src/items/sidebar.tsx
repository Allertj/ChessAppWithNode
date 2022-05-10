const SideBar = (data: any) => {
    let white = data.moves.filter((move : any) => move.player === "WHITE")
           .map((moves: any) => 
                 <div key={moves.notation}>{moves.piece !== "P" && moves.piece} {moves.notation}</div>)
    let black = data.moves.filter((move: any) => move.player === "BLACK")
           .map((moves: any) => 
                 <div key={moves.notation}>{moves.piece !== "P" && moves.piece} {moves.notation}</div>)
    const concede = () => {
        data.setStatus("You have conceded")
        data.concede()
    }

    return (
      <div className="sidebar flex-child">
        <div className='flex-container'>
        <div className='column sidebar-option' onClick={concede}>CONCEDE</div> 
        <div className='column sidebar-option' onClick={data.proposeDraw}>PROPOSE DRAW</div>          
        </div>
        <div className="moves">STATUS:</div>
          <div id="caller">{data.status}</div>
            <div className="moves">MOVES:</div>
              <div className='some-page-wrapper'>
                <div className='row'>
                  <div className='column'>
                    <div className='blue-column'>
                      <div className='moves-title'>WHITE</div>
                      {white}
                    </div>
                  </div>
                  <div className='column'>
                    <div className='green-column'>
                      <div className='moves-title'>BLACK</div>
                      {black}
                  </div>
                </div>
              </div>
           </div>
      </div>
    )
  }

  export { SideBar }