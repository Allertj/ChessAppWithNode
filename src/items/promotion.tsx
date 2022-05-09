import React from 'react';
  
function Popup (data: any){
  let choice = ""
  const promotionChoice = () => {
      data.askPromotePiece(choice)
      choice = ""
  }
  return(
    <div id={data.openMenu ? "choose" : "choose-hidden"}> 
      <div className="choose-text">Select a piece to promote to:</div>
      <button className="promotion--button" onClick={() => {choice= "Q"; promotionChoice()}} >♕</button>
      <button className="promotion--button" onClick={() => {choice= "R"; promotionChoice()}}>♖</button>
      <button className="promotion--button" onClick={() => {choice= "B"; promotionChoice()}}>♗</button>
      <button className="promotion--button" onClick={() => {choice= "K"; promotionChoice()}}>♘</button>   
  </div>
  )
};

export { Popup }