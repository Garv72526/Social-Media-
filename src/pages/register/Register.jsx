import React from 'react'
import "./register.css"
import { useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import axios from "axios"
function Register() {
  //.current is created as an object when useRef is used
  const username=useRef();
  const email=useRef();
  const password=useRef();
  const passwordAgain=useRef();
  const navigate=useNavigate();
  const handleClick= async(e)=>{
    e.preventDefault();
    if(passwordAgain.current.value!== password.current.value){
      password.current.setCustomValidity("Passwords dont match")
    }else{
      const user={
        username:username.current.value,
        email:email.current.value,
        password:password.current.value,
        passwordAgain:passwordAgain.current.value
      }
      try{
      const res=await axios.post("/api/auth/register",user)
      console.log(res.data)
        navigate("/login");
    }
      catch(err){
        console.log(err)
      }
    }
  }
  return (
  
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on social.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Username" required ref={username} className="loginInput" />
            <input placeholder="Email" required ref={email} className="loginInput" type="email"/>
            <input placeholder="Password" required ref={password} className="loginInput" type="password" />
            <input placeholder="Password Again" required ref={passwordAgain}  className="loginInput" type="password" />
            <button className="loginButton" type="submit">Sign Up</button>
            <button className="loginRegisterButton" type="button">
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>


  )
}

export default Register