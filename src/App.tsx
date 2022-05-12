import React from 'react';
import { ProfilePage } from './items/profilepage';
import { LoginScreen } from './items/login'
import { MainContainer } from './items/maincontainer'
import { NavBar } from './items/navbar'
import { Register} from './items/register'
import { makeGETRequestAuth} from './items/requests'
import { server } from './config'
import { Routes, Route, useNavigate } from "react-router-dom";

const Page = () => {
  let [retrievedGames, setRetrievedGames] = React.useState([])
  let [gameasjson, setGameAsJson] = React.useState({})
  let [userdata, setUserData] = React.useState({id: "", accessToken: ""}) 

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
      makeGETRequestAuth (`${server}/profile/${userdata.id}`, loadProfile, "", userdata.accessToken)
      navigate("/profile", { replace: true });
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
      setUserData({accessToken : "", id : ""})
      navigate("/login", { replace: true });
  }
  let profile = <ProfilePage userdata={userdata} 
                             checkForGames={checkForGames}
                             retrievedGames={retrievedGames} 
                             handlechoice={chooseGame}/>


  let standard =  userdata.accessToken === "" ? <LoginScreen login={loginthesite}/> : profile
  return (<div className="main-container">
            
            <NavBar handleLogout={handleLogout} 
                    checkForGames={checkForGames} 
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
                                 <MainContainer gamedata={gameasjson} 
                                                userdata={userdata}/>}/> 
                <Route path="*" element={standard} />                                 
            </Routes>                                                     
         </div>)      
}

export { Page } 
