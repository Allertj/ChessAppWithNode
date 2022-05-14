import React from 'react';
import { useNavigate } from "react-router-dom";
import { makePOSTRequestAuth, makeGETRequestAuth } from '../misc/requests'
import { server } from '../config'
import { reviver} from '../misc/helper'
import {ProfilePageHolder} from './profilepageholder'

const ProfilePage = (props: any) => {
  let navigate = useNavigate();
  let [showCurrent, setShowCurrentState] = React.useState(true)
  let [retrieveGames, setRetrieveGames] = React.useState([])
  
  React.useEffect(() => {
      askNewGames()
  }, [])

  const setShowCurrent = () => {
       setShowCurrentState(!showCurrent)  
      if (!showCurrent) {
         askNewGames()
      } else {
          makeGETRequestAuth(`${server}/profile/${props.userdata.id}/closed`, getOldGames, "", props.userdata.accessToken)
      }
  }
  const askNewGames = () => {
      makeGETRequestAuth(`${server}/profile/${props.userdata.id}/open`, getNewGames, "", props.userdata.accessToken)
  }
  const createNewGame = () => {
      makePOSTRequestAuth(`${server}/newgame`, 
                            props.userdata, 
                            askNewGames, 
                            "", 
                            props.userdata.accessToken)
  }
  const getNewGames = (data: any) => {
      setRetrieveGames(data)
  }
  const getOldGames = (data: any) => {
      setRetrieveGames(data) 
  }
  const loadGame = (gameid: string) => {
    makeGETRequestAuth(`${server}/requestgamedata/${gameid}`, loadedGameRetrieved, "", props.userdata.accessToken) 
  }
  const loadedGameRetrieved = (data: any) => {
      let color = (data.player1id === props.userdata.id ? 1 : 0)
      let gamedata = JSON.parse(data.gameasjson, reviver)         
      gamedata.color = color
      gamedata.id = data._id
      gamedata.unverified_move = data.unverified_move
      gamedata.draw_proposed = data.draw_proposed
      props.handlechoice(gamedata)
      navigate("/game", { replace: true });
  }
  return <ProfilePageHolder userdata={props.userdata}
                            showCurrent={showCurrent}
                            loadGame={loadGame}
                            createNewGame={createNewGame}
                            setShowCurrent={setShowCurrent}
                            retrievedGames={retrieveGames}/>
  }  

  export { ProfilePage }