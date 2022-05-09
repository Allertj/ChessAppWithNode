import React from 'react'
import { makePOSTRequest } from './requests'
import { server } from '../config'
import { useFetch, usePOSTFetch } from './might_be_useful'
import { useNavigate } from "react-router-dom";

const LoginScreen = (data:any) => {
  let [messages, updateMessage] = React.useState("")
  const [formData, setFormData] = React.useState({ username: "", password: "", })
  let navigate = useNavigate();

  const handleRequest = (receivedData: any) => {  
    if (!receivedData) {
      updateMessage("Server has not responded.")      
    } else if (receivedData.accessToken == null) {
      updateMessage(receivedData.message)
    } else {
      data.login(receivedData)
      navigate("/profile", { replace: true });
    }
  }
  const submitForm = (event: any) => {
    event.preventDefault()
    // let { loading, data, error } = usePOSTFetch(`${server}/api/auth/signin`, formData)
    // console.log("submtiform", loading, data, error)
    makePOSTRequest(`${server}/api/auth/signin`, formData, handleRequest, "")  
    // loginUser(formData, handleRequest)
    // { loading, data, error }
}
  const setData = (data: any) => {
    setFormData(prevState => {
      return {  ...prevState,
                [data.target.name] : data.target.value } 
    })
  }

  return (<div className='login'>
            <form onSubmit={submitForm}>
              <div className='center-form'><label>Email</label></div>
              <div><input type="text" name="username" onChange={setData} value={formData.username}/></div>
              <div>{messages}</div>
              <div className='center-form'><label>Password</label></div>
              <div><input type="text" name="password" onChange={setData} value={formData.password}/></div>
              {/* <div>{data.messages.passwordmsg}</div> */}
              <div className='center-form'><button type="submit">Login</button></div>
            </form>
          </div>)
}

export { LoginScreen }