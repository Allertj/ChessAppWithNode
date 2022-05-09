import './App.css';
import React from 'react';
import { ProfilePage } from './items/profilepage';
import { LoginScreen } from './items/login'
import { MainContainer } from './items/maincontainer'
import { NavBar } from './items/navbar'
import { Register} from './items/register'
import { makeGETRequest, makeGETRequestAuth} from './items/requests'
import { server } from './config'
import { createSocket }from './items/createsocket'
import { Routes, Route, Navigate } from "react-router-dom";

const Page = () => {
  let [retrievedGames, setRetrievedGames] = React.useState([])
  let [gameasjson, setGameAsJson] = React.useState({})
  let [userdata, setUserData] = React.useState({}) 
  let [activescreen, setActiveScreen] = React.useState("Login")

  const setActive = (newstate: any) => {
      setActiveScreen(newstate)
  }  

  const loadProfile = (data: any) => {
    setRetrievedGames(data)
    setActive("Profile")
}
  const loginthesite = (data : any) => {
      setUserData(data)
      makeGETRequestAuth (`${server}/profile/${data.id}`, loadProfile, "", data.accessToken)
  }

  const checkForGames = () => {
    //@ts-expect-error
      makeGETRequestAuth (`${server}/profile/${userdata.id}`, loadProfile, "", userdata.accessToken)
  }

  const chooseGame = (gameasjson: JSON) => {
      setGameAsJson(gameasjson)
      setActive("Game")
  }
  console.log(userdata, userdata == "", "USERDATA")
  return (<div className="main-container">
            
            <NavBar handlelogin={setActive} 
                    profile={checkForGames} 
                    active={activescreen} 
                    userdata={userdata}/> 
            <Routes>
                <Route path="/" 
                       element={<LoginScreen login={loginthesite}/>} />
                <Route path="/login" 
                       element={<LoginScreen login={loginthesite}/>} />       
                <Route path="/register" 
                       element={<Register/>} />     
                <Route path="/profile" 
                       element={<ProfilePage userdata={userdata} 
                                             checkForGames={checkForGames}
                                             retrievedGames={retrievedGames} 
                                             handlechoice={chooseGame}/>} />             
                <Route path="/game" 
                //@ts-expect-error
                       element={<MainContainer socket={createSocket(userdata.accessToken, userdata.id)}
                                               gamedata={gameasjson} 
                                               activescreen={activescreen}  
                                               userdata={userdata}/>}/> 
                <Route path="*" element={ userdata === "" ? <Navigate to="/login" />: <Navigate to="/profile" />} />                                 
            </Routes>  

            {/* {(activescreen === "Login")     && <LoginScreen login={loginthesite}/>}
            {(activescreen === "Register")  && <Register/>}  
            {(activescreen === "Profile")   && <ProfilePage     userdata={userdata} 
                                                                checkForGames={checkForGames}
                                                                retrievedGames={retrievedGames} 
                                                                handlechoice={chooseGame}/>}
            {(activescreen === "Game")      && <MainContainer   socket={createSocket(userdata.accessToken, userdata.id)}
                                                                gamedata={gameasjson} 
                                                                activescreen={activescreen}  
                                                                userdata={userdata}/>} */}
                                                    
         </div>)      
}

export { Page } 
