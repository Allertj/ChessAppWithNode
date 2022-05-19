import React from 'react';
import { ProfilePage } from './profile/profilepage';
import { LoginScreen } from './items/login'
import { MainContainer } from './gameplay/maincontainer'
import { NavBar } from './items/navbar'
import { Register} from './items/register'
import { Routes, Route, useNavigate } from "react-router-dom";
import {UserData, GameAsJson} from './interfaces/interfaces'

const Page = () => {
  let navigate = useNavigate();
  let [gameasjson, setGameAsJson] = React.useState({})
//   let [userdata, setUserData] = React.useState() 
  let [userdata, setUserData] = React.useState({id: "", accessToken: "", username: ""}) 

  const saveUserData = (data : UserData) => {
    //   console.log(data, "saveuserdata")
      localStorage.setItem("userdata", JSON.stringify(data))
      setUserData(data)
      navigate("/profile", { replace: true });
  }

  const chooseGame = (gameasjson: GameAsJson) => {
    //   console.log("gameasJson", gameasjson)
      setGameAsJson(gameasjson)
  }

  React.useEffect(() => {
    let results = localStorage.getItem("userdata")   
    if (results !== null) {
        setUserData(JSON.parse(results))
    }
  }, [])

  const handleLogout = () => {
      localStorage.removeItem("userdata")
      setUserData({accessToken : "", id : "", username: ""})
      navigate("/login", { replace: true });
  }
  let profile = <ProfilePage userdata={userdata}  
                             handlechoice={chooseGame}/>

  let standard =  userdata.accessToken === "" ? <LoginScreen login={saveUserData}/> : profile
  return (<div className="main-container">
            
            <NavBar handleLogout={handleLogout}  
                    username={userdata.username}/> 
            <Routes>
                <Route path="/" 
                       element={<LoginScreen login={saveUserData}/>} />
                <Route path="/login" 
                       element={<LoginScreen login={saveUserData}/>} />       
                <Route path="/register" 
                       element={<Register/>} />     
                <Route path="/profile" 
                       element={standard} />             
                <Route path="/game" 
                       element={Object.keys(gameasjson).length === 0 ? standard :
                                 <MainContainer gamedata={gameasjson} 
                                                userdata={userdata}/>}/> 
                <Route path="*" element={standard} />                                 
            </Routes>                                                     
         </div>)      
}

export { Page } 
