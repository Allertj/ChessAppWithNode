import './App.css';
import React from 'react';
import { ProfilePage } from './items/profilepage';
import { LoginScreen } from './items/login'
import { MainContainer } from './items/maincontainer'
import { NavBar } from './items/navbar'
import { Register} from './items/register'
import { makeGETRequestAuth} from './items/requests'
import { server } from './config'
import { createSocket }from './items/createsocket'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const Page = () => {
  let [retrievedGames, setRetrievedGames] = React.useState([])
  let [gameasjson, setGameAsJson] = React.useState({})
  let [userdata, setUserData] = React.useState({}) 

  const loadProfile = (data: any) => {
      setRetrievedGames(data)
  }

  const loginthesite = (data : any) => {
      let aaa =  JSON.stringify(data)
      localStorage.setItem("userdata", aaa)
      setUserData(data)
      makeGETRequestAuth (`${server}/profile/${data.id}`, loadProfile, "", data.accessToken)
  }

  const checkForGames = () => {
    //@ts-expect-error
      makeGETRequestAuth (`${server}/profile/${userdata.id}`, loadProfile, "", userdata.accessToken)
  }

  const chooseGame = (gameasjson: JSON) => {
      setGameAsJson(gameasjson)
  }

  React.useEffect(() => {
    let results = localStorage.getItem("userdata")   
    if (results !== null) {
        setUserData(JSON.parse(results))
    }
  }, [])
  let navigate = useNavigate();
  const handleLogout = () => {
      localStorage.removeItem("userdata")
      setUserData({})
      navigate("/login", { replace: true });
  }
  let profile = <ProfilePage userdata={userdata} 
                             checkForGames={checkForGames}
                             retrievedGames={retrievedGames} 
                             handlechoice={chooseGame}/>


  let standard =  Object.keys(userdata).length === 0 ? <LoginScreen login={loginthesite}/> : profile
  console.log(Object.keys(userdata).length === 0, "standard") 
  return (<div className="main-container">
            
            <NavBar handleLogout={handleLogout} 
                    profile={checkForGames} 
                    userdata={userdata}/> 
            <Routes>
                <Route path="/" 
                       element={<LoginScreen login={loginthesite}/>} />
                <Route path="/login" 
                       element={<LoginScreen login={loginthesite}/>} />       
                <Route path="/register" 
                       element={<Register/>} />     
                <Route path="/profile" 
                       element={standard} />             
                <Route path="/game" 
                       element={Object.keys(gameasjson).length === 0 ? standard :
                                        //@ts-expect-error 
                                 <MainContainer socket={createSocket(userdata.accessToken, userdata.id)}
                                                gamedata={gameasjson} 
                                                userdata={userdata}/>}/> 
                <Route path="*" element={standard} />                                 
            </Routes>                                                     
         </div>)      
}

export { Page } 
