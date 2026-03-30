import React, { useContext, useRef } from 'react'
import "./login.css"
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import {CircularProgress,LinearProgress} from "@mui/material"

function Login() {
  const email= useRef();//useRef=>Store a value that does NOT cause re-render when it changes.
  const password=useRef();
  const {user,isFetching,error,dispatch}=useContext(AuthContext)


  const handleClick=(e)=>{
    e.preventDefault();//so that page does not refresh when we click login
    loginCall({email:email.current.value,password:password.current.value},dispatch)
  }
  console.log(user)
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Email" type='email' className="loginInput" ref={email} required/>
            <input placeholder="Password" type='password' className="loginInput" ref={password} required />
            <button className="loginButton">{isFetching?<LinearProgress />:"log in "}</button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
            {isFetching?<LinearProgress />:"Create a New Account"}   
            </button>
          </form>
        </div>
      </div>
    </div>

  )
}

export default Login