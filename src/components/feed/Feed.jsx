import React, { useContext } from 'react'
import "./feed.css"
import Share from '../share/Share'
import Post from '../Post/Post'
import { Posts } from '../../dummyData'
import { useState,useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../../context/AuthContext'
function Feed({username}) {
  const [posts,setPosts]=useState([])
  const {user}=useContext(AuthContext)
  useEffect(()=>{
    const fetchPosts =async ()=>{
        // axios.get sends a GET request to "/api/posts/timeline/userId"
        // this is a relative URL -> browser turns it into http://localhost:5173/api/posts/...
        // vite proxy intercepts it and forwards to -> http://localhost:5000/api/posts/...
        // so express backend receives the request and returns matching posts
      const res =username ? await axios.get("/api/posts/profile/"+username):await axios.get("/api/posts/timeline/" + user._id)
      setPosts(res.data.sort((p1,p2)=>{
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }))
      //to show posts new first
      console.log(res.data)
    }
    fetchPosts();
  },[username,user._id])//run only once so add an dependency 
  return (
    <div className='feed'>
      <div className="feedWrapper">
          <Share/>
          {/* {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}  now instead of using dummy data we fetch from backed to get all timeline posts and use it*/}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}  
        </div>
    </div>
  )
}

export default Feed