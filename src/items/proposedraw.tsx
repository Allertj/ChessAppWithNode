export const ProposeDraw = (data: any) => {
    let choice = false
    const proposeDrawAnswer = () => {
      data.drawAnswer(choice)
    }
    return(
        <div id={data.openMenu ? "choose" : "choose-hidden"}> 
          <div className="choose-text">The other player has proposed a draw:</div>
          <button className="promotion--button" onClick={() => {choice= true; proposeDrawAnswer()}}>Accept</button>
          <button className="promotion--button" onClick={() => {choice= false; proposeDrawAnswer()}}>Decline</button>  
        </div>
    )
  };

