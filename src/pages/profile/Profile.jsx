import React from 'react'
import "./profile.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Rightbar from '../../components/rightbar/Rightbar'
import Feed from '../../components/feed/Feed'
import axios from "axios"
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'//to get username from parameter which we defined in App.jsx gets dynamic data(:username)
function Profile() {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;

    const[user,setUser]=useState({})
    const username=useParams().username;
    useEffect(()=>{
        const fetchUser =async ()=>{
          const res =await axios.get(`/api/users?username=${username}`)//
          setUser(res.data)
        }
        fetchUser();
      },[username])
  return (
        <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture ? PF + user.coverPicture : PF + "post/3.jpeg"}
                alt=""
              />
              <img
                className="profileUserImg"
                src={(PF+user.profilePicture)||(PF+"person/7.jpeg")}
                alt=""  
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>

  )
}

export default Profile